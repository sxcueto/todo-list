import TodoListItem from "./TodoListItem";

const filteredTodoList = TodoList.filter(todo => !todo.isCompleted);

function TodoList({ filteredTodoList, onCompleteTodo }) {
  return (
   filteredTodoList.length === 0 ? <p>Add todo above to get started.</p> :
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo}/>
      ))}
    </ul>
  );
}

export default TodoList;



