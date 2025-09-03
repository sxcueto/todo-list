import { useRef } from "react";
import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");
  const [setIsSaving] = useState(false);

  async function handleAddTodo(event) {
    event.preventDefault();
    setIsSaving(true);
    await onAddTodo({ title: workingTodoTitle, isCompleted: false });
    setWorkingTodoTitle("");
    todoTitleInput.current.focus();
    setIsSaving(false);
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
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
