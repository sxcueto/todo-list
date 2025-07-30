import TodoListItem from './TodoListItem.jsx'

function TodoList(){
      const todos = [
    {id: 1, title: "clean room"},
    {id: 2, title: "take out trash"},
    {id: 3, title: "do laundry"},
  ] 
  return(
     <div>
  
  <ul>
    {todos.map(todo => <li key={todo.id}><TodoListItem title={todo.title} /> </li>)}
  </ul>
</div>
    )
}

export default TodoList