import { useEffect, useState } from "react";
import styled from 'styled-components';



const StyledForm = styled.form`
  padding: 1.5rem;
  
  `;

const StyledLabel = styled.label`
  padding-right: 0.4rem;
  `;
const StyledDiv = styled.div`
padding-bottom: 0.7rem;
`;

const StyledInput = styled.input`
    padding: .2rem;
  `;

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh(event) {
    event.preventDefault();
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <>
      <StyledForm onSubmit={(event) => preventRefresh(event)}>
        <StyledDiv>
          <StyledLabel>Search todos</StyledLabel>
          <StyledInput
            type="text"
            value={queryString}
            onChange={(e) => {
              setQueryString(e.target.value);
            }}
          />
          <button type="button" onClick={() => setQueryString("")}>
            Clear
          </button>
        </StyledDiv>

        <div>
          <StyledLabel>Sort by</StyledLabel>
          <select
            onChange={(event) => {
              setSortField(event.target.value);
            }}
            value={sortField}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
          <StyledLabel>Direction</StyledLabel>
          <select
            onChange={(event) => {
              setSortDirection(event.target.value);
            }}
            value={sortDirection}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </StyledForm>
    </>
  );
}
export default TodosViewForm;
