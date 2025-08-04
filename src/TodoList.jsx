import TodoListItem from './TodoListItem.jsx'

function TodoList({ todos }){
 <TodoListItem />
  return(
     <div>
  <ul>
    {todos.map(todo => <li key={todo.id}><TodoListItem todo={todo.title} /> </li>)}
  </ul>
</div>
    )
}

export default TodoList