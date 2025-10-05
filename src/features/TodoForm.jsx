import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

//styling for add todo button
const StyledButton = styled.button`
  padding: 0.2rem;
  font-style: normal;
  &:disabled {
    font-style: italic;
    font-weight: bolder;
  }
`;
//styling for todo input bar and add todo button
const StyledForm = styled.form`
  display:flex;
  padding: 0.5em;
  margin:auto;
  justify-content:center;
  
`;
function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo({
      title: workingTodoTitle,
      isCompleted: false,
    });
    setWorkingTodoTitle("");
    todoTitleInput.current.focus();
  }

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
      <StyledButton disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
