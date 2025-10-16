import { useEffect, useState, useCallback, useReducer } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import styles from "./App.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodoState,
} from "./reducers/todos.reducer";
import TodosPage from "./pages/TodosPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./shared/header";

function App() {
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");
  const [todoState, dispatch] = useReducer(todosReducer, initialTodoState);
  const location = useLocation();
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

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Todo List";
        break;
      case "/about":
        document.title = "About";
        break;
      default:
        document.title = "Not Found";
    }
  }, [location]);

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
      dispatch({ type: todoActions.setSaving, isSaving: true });

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
      dispatch({ type: todoActions.setSaving, isSaving: false });
    }
  };

  async function completeTodo(id, title) {
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: title,
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
    dispatch({ type: todoActions.completeTodo, id: id });

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        const errorData = await resp.json();

        throw new Error(
          `Failed to update todo: ${errorData.error.message || "Unknown error"}`
        );
      }
      dispatch({ type: todoActions.completeTodo, id: id, isCompleted: true });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo: { id, title } });
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
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo: editedTodo });
      dispatch({
        type: todoActions.setLoadError,
        errpr: { messages: error.message },
      });
    } finally {
      dispatch({ type: todoActions.setSaving, isSaving: false });
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
      <Header
        title={
          location.pathname === "/"
            ? "Todo List"
            : location.pathname === "/about"
            ? "About"
            : "Not Found"
        }
      />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              addTodo={addTodo}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              sortField={sortField}
              setSortField={setSortField}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <hr />

      {todoState.errorMessage && (
        <>
          <hr />
          <p className={styles.errorMessage}>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </>
      )}
    </div>
  );
}

export default App;
