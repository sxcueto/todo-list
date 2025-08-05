import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todos }) {
 
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
