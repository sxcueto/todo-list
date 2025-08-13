function TodoListItem({ todo, completeTodo }) {
  return (
    <li>
      <form>
        <input type="checkbox" checked= {todo.isCompleted} onchange={ () => completeTodo(todo.id)} />
        {todo.title}
      </form>
    </li>
  );
}

export default TodoListItem;
