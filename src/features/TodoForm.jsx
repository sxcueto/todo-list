import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from 'styled-components';

//using styled components 
    // Minimum: 
//    Keep the styled components inside the main component file unless they are shared between components.
//    Keep naming simple - use a prefix "Styled" for each element that is replaced with a styled-component: eg: StyledForm, StyledButton, etc.
//     Make minimal changes to the JSX just to swap elements out with the styled components you define.
    // Add a small amount of padding on the items in each form to give them some spacing.

const StyledButton = styled.button`
  padding: 0.2rem;
  font-style: normal;
  &:disabled {
    font-style: italic;
    font-weight: bolder;
  }
`;

const StyledForm = styled.form`
  padding: 0.5rem;
  `;
function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo({ 
      title: workingTodoTitle, 
      isCompleted: false 
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
