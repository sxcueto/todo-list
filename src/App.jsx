import './App.css'

function App() {
  const todos = [
    {id: 1, title: "clean room"},
    {id: 2, title: "take out trash"},
    {id: 3, title: "do laundry"},
  ]
  return(
<div>
  <h1>My Todos</h1>
  <ul>
    {todos.map(todo => <li key={todo.id}>{todo.title} </li>)}
  </ul>
</div>
  
)}

export default App
