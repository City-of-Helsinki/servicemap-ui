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
    case 'SET_SELECTED_UNIT_FILTER':
      return {
        ...state,
        selectedUnit: action.filter,
      };
    default:
      return state;
  }
};
