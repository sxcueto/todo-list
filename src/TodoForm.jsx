import { useRef } from "react";
import { useState } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodo] = useState{""}; 
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle); //invoke onAddTodo w/title
    setWorkingTodo('');
    todoTitleInput.current.focus();

  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodo(event.target.value) }
      />
      <button disabled={workingTodoTitle === ""} >Add Todo</button>
    </form>
  );
}

export default TodoForm;
