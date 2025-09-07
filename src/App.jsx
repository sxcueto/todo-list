import { useCallback, useEffect, useState } from "react";
import "./App.css";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm";
function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("created item");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
const encodeUrl = useCallback(({ sortField, sortDirection, queryString }) => {
    let searchQuery = "";
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
    }
    return (`${url}?${sortQuery}${searchQuery}`);
  }, [url]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: "GET",
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          options
        );

        if (!resp.ok) {
          throw new Error("Failed to fetch todos");
        }
        const { records } = await resp.json();

        const fetchedTodos = records.map((record) => {
          return {
            id: record.id,
            title: record.fields.title,
          };
        });
        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchTodos();
    } else {
      setIsLoading(false);
    }
  }, [sortDirection, sortField, queryString, token, encodeUrl]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl(sortDirection, sortField, queryString),
        options
      );
      const errorDetails = await resp.text();
      if (!resp.ok)
        throw new Error(
          `HTTP error! status:${resp.status}, details: ${errorDetails}`
        );

      const { records } = await resp.json();
      const savedTodos = {
        id: records[0].id,
        title: records[0].fields,
        isCompleted: records[0].fields.isCompleted,
      };
      console.log(records);
      console.log(savedTodos);

      setTodoList((prevTodoList) => [...prevTodoList, savedTodos]);
    } catch (error) {
      console.log("Error saving todo:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) {
      console.log("Todo not found");
      setErrorMessage("Todo not found");
      return;
    }
    const payload = {
      records: [
        {
          id: originalTodo.id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );

    try {
      const resp = await fetch(encodeUrl, options);
      if (!resp.ok) throw new Error();
    } catch (error) {
      console.log("Error completing todo:", error);
      setErrorMessage(error.message);
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  }
  function handleAddTodo(title) {
    const newTodo = { title, isCompleted: false };
    addTodo(newTodo);
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === editedTodo.id
          ? {
              ...todo,
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
            }
          : todo
      )
    );

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl, options);
      if (!resp.ok) throw new Error();

      const { records } = await resp.json();

      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      const updatedTodoList = todoList.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      setTodoList(updatedTodoList);
    } catch (error) {
      console.log("Error updating todo:", error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodoList = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodoList);
    } finally {
      setIsSaving(false);
    }
  }

  const dismissError = () => {
    setErrorMessage("");
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={dismissError}>Dismiss</button>
        </>
      )}
    </div>
  );
}
export default App;
