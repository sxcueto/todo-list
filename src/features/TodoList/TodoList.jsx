import { useSearchParams, useNavigate } from "react-router";
import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";
import { useEffect } from "react";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const indexOfFirstTodo = itemsPerPage * (currentPage - 1);
  const totalPages = Math.ceil(todoList.length / itemsPerPage);
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage - 1 <= 1) {
      setSearchParams({ page: currentPage - 1 });
    } else {
      setSearchParams({ page: 1 });
    }
  };
  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setSearchParams({ page: currentPage + 1 });
    } else {
      setSearchParams({ page: totalPages });
    }
  };
  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      navigate("/");
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.unorderedList}>
          {currentTodos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}
export default TodoList;
