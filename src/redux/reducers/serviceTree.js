const initialState = {
  services: [],
  selected: [],
  opened: [],
  fetching: [],
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
    case 'ADD_OPENED_NODE':
      return {
        ...state,
        opened: [...state.opened, action.node],
      };
    case 'REMOVE_OPENED_NODE':
      return {
        ...state,
        opened: [...state.opened.filter(item => item !== action.node)],
      };
    case 'START_NODE_FETCH':
      return {
        ...state,
        fetching: [...state.fetching, action.nodeID],
      };
    case 'END_NODE_FETCH':
      return {
        ...state,
        services: [...state.services, ...action.data.nodes],
        fetching: [...state.fetching.filter(item => item !== action.data.nodeID)],
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
