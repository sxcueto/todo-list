import TodoForm from "../features/TodoForm";
import TodoList from "../features/TodoList/TodoList";
import TodosViewForm from "../features/TodosViewForm";

const TodosPage = ({
  todoState,
  completeTodo,
  updateTodo,
  addTodo,
  sortDirection,
  sortField,
  queryString,
  setSortDirection,
  setSortField,
  setQueryString
}) => {
  return (
    <div>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </div>
  );
};

export default TodosPage;
