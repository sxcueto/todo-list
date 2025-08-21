import "./App.css";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import { useState } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);

  function completeTodo(todoId) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  function handleAddTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };

    setTodoList([...todoList, newTodo]);
  }

  function updateTodo(editedTodo){
const revisedTodos = todoList.map((todo) => {
  if (todo.id === editedTodo.id) {
    return {...editedTodo };
  }
  return todo;
});

setTodoList(revisedTodos);

  };



  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  );
}
export default App;
