const initialState = {
  services: [],
  selected: [],
  opened: [],
};

const serviceTreeReducer = (state = initialState, action) => {
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

export default serviceTreeReducer;
