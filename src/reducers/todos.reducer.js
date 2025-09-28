const actions = {
  //actions in useEffect that loads todos
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  //found in useEffect and addTodo to handle failed requests
  setLoadError: "setLoadError",
  //actions found in addTodo
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",
  //found in helper functions
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  //reverts todos when requests fail
  revertTodo: "revertTodo",
  //action on Dismiss Error button
  clearError: "clearError",
};

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos: {
      const list = action.records.map((record) => {
        let todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.booleanProperty) {
          todo.booleanProperty || false;
        }
        return todo;
      });
      return {
        ...state,
        todoList: [...list],
        isLoading: false,
      };
    }
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo: {
      const savedTodo = {
        id: action.records[0].id,
        title: action.records[0].fields.title,
        isCompleted: action.records[0].fields.isCompleted || false,
      };

      return {
        ...state,

        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.updateTodo: {
      const originalTodo = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id
          ? { ...todo, ...action.editedTodo }
          : todo
      );

      const updatedState = { ...state, originalTodo };

      return {
        updatedState,
      };
    }

    case actions.completeTodo: {
      const originalTodo = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { todo, isCompleted: true };
        } else {
          return todo;
        }
      });
      return {
        ...state,
        todoList: originalTodo,
      };
    }
    case actions.revertTodo: {
      const originalTodo = action.originalTodo;
      const revertedTodoList = state.todoList.map((todo) =>
        todo.id === originalTodo.id ? {...originalTodo} : todo
      );

      return {
        ...state,
        todoList: revertedTodoList,
        errorMessage: action.error
          ? `${action.error.message}. Reverting todo...`
          : "",
      };
    }
    case actions.clearError:
      return {
        ...state,
        errorMessage: "",
      };
    default:
      return state;
  }
}

export { initialState, actions, reducer };
