const initialState = {
  services: [],
  selected: [],
  opened: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SERVICE_TREE':
      return {
        ...state,
        ...action.serviceTree,
      };
    default:
      return state;
  }
};
