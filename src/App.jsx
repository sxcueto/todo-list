import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useState } from "react";

function App() {
  const [newTodo, setNewTodo] = useState('New todo will be here');
  
    const todos = [
    {id: 1, title: "clean room"},
    {id: 2, title: "take out trash"},
    {id: 3, title: "do laundry"},
  ] 
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList todos={todos} />
    </div>
  );
}

export default App;
