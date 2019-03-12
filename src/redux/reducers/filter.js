const initialState = {
  filter: null,
  selected: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter,
      };
    case 'SET_SELECTED_FILTER':
      return {
        ...state,
        selected: action.filter,
      };
    default:
      return state;
  }
};
