const initialState = {
  services: [],
  selected: [],
  opened: [],
  fetched: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TREE_SERVICES':
      return {
        ...state,
        services: action.services,
      };
    case 'SET_TREE_SELECTED':
      return {
        ...state,
        selected: action.selected,
      };
    case 'SET_TREE_OPENED':
      return {
        ...state,
        opened: action.opened,
      };
    case 'SET_TREE_FETCHED':
      return {
        ...state,
        fetched: [...state.fetched, action.node],
      };
    default:
      return state;
  }
};
