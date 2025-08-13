function TodoListItem({ todo, completeTodo }) {
  return (
    <li>
      <form>
        <input type="checkbox" checked= {todo.isCompleted} onChange={ () => completeTodo(todo.id)} />
        {todo.title}
      </form>
    </li>
  );
}

export default TodoListItem;
