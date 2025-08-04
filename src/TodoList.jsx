import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todos }) {
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoListItem todo={todo} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
