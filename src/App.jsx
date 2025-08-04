import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

function App() {
  const [todos , setTodos] = useState(TodoList);
  
  return(
    <div>
    <h1>My Todos</h1>
<TodoForm />
<p>setTodos={setTodos}</p>
 <TodoList />
 
  </div>
)}

export default App
