import { useEffect, useState, useCallback, useReducer } from "react";
import "./App.css";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm";
import styles from "./App.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodoState,
} from "./reducers/todos.reducer";

function App() {
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isSaving, setIsSaving] = useState(false);
  // //
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");
  const [todoState, dispatch] = useReducer(todosReducer, initialTodoState);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let searchQuery = "";
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: "GET",
        headers: { Authorization: token, "Content-Type": "application/json" },
      };

      try {
        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();

        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error: { message: error.message },
        });
      }
    };
    fetchTodos();
  }, [token, encodeUrl]);

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
      dispatch({ type: todoActions.setSaving, isSaving:true });

      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        const errorDetails = await resp.text();
        throw new Error(
          `HTTP error! status:${resp.status}, details: ${errorDetails}`
        );
      }

      const { records } = await resp.json();

      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error: { message: error.message },
      });
    } finally {
      dispatch({ type: todoActions.setSaving, isSaving:false });
    }
  };

  async function completeTodo(originalTodo) {
   
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      dispatch({ type: todoActions.completeTodo, id: originalTodo.id });

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) throw new Error("Failed to update todo");
      } catch(error) {
        dispatch({ type: todoActions.revertTodo, originalTodo });
        dispatch({
          type: todoActions.setLoadError,
          error: { message: error.message },
        });
      }
    }

    async function updateTodo(editedTodo) {
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

      dispatch({
        type: todoActions.updateTodo,
        editedTodo: {
          id: editedTodo.id,
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        },
      });

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) throw new Error();
      } catch(error) {
        dispatch({ type: todoActions.revertTodo, originalTodo:editedTodo });
        dispatch({type: todoActions.setLoadError, errpr:{messages: error.message},})
      } finally {
        dispatch({ type: todoActions.setSaving, isSaving:false });
      }
    }

    const dismissError = () => {
      dispatch({
        type: todoActions.clearError,
        error: { message: "" },
      }); 
    };

    return (
      <div className={styles.appContainer}>
        <h1 className={styles.heading}>My Todos</h1>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
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

        {todoState.errorMessage && (
          <>
            <hr />
            <p className={styles.errorMessage}>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError})}>Dismiss</button>
          </>
        )}
      </div>
    );
  }

export default App;
