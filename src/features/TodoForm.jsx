import { useRef } from "react";
import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodo] = useState("");
  const todoTitleInput = useRef("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAddTodo(event) {
    event.preventDefault();
    setIsSaving(true);
    await onAddTodo({ title: workingTodoTitle, isCompleted:false }); 
    setWorkingTodo("");
    todoTitleInput.current.focus();
    setIsSaving(false);
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodo(event.target.value)}
        elementId={"todoTitle"}
        labelText="Todo"
      />
      <button disabled={workingTodoTitle === ""}>
        {" "}
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
