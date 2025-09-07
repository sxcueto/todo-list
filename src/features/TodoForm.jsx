import { useRef, useState  } from "react";
import  TextInputWithLabel  from "../shared/TextInputWithLabel";


function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");
  

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo({ title: workingTodoTitle, isCompleted: false });
    setWorkingTodoTitle("");
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId={"todoTitle"}
        label="Todo"
      />
      <button disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
