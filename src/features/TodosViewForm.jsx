import { useEffect, useState } from "react";

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
  }

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
      <form onSubmit={(event) => preventRefresh(event)}>
        <div>
          <label>Search todos</label>
          <input
            type="text"
            value={queryString}
            onChange={(e) => {
              setLocalQueryString(e.target.value);
            }}
          />
          <button type="button" onClick={() => setLocalQueryString("")}>
            Clear
          </button>
        </div>

        <div>
          <label>Sort by</label>
          <select
            onChange={(event) => {
              setSortField(event.target.value);
            }}
            value={sortField}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
          <label>Direction</label>
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
      </form>
    </>
  );
}
export default TodosViewForm;
