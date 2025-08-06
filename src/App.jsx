import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useState } from "react";


function App() {
  const [todoList, setTodoList] = useState([]);
   const todos = [
    {id: 1, title: "clean room"},
    {id: 2, title: "take out trash"},
    {id: 3, title: "do laundry"},
  ];
  
  function handleAddTodo(title){

  const newTodo = { title, id: Date.now()};// uses title and id as keys
  
setTodoList([...todoList,newTodo]);

 }  
  return (
    <div>
      <h1>My Todos</h1>
       <TodoForm onAddTodo={handleAddTodo} /> 
      <TodoList todoList={todoList} />
    </div>
  );
 

}
export default App;
