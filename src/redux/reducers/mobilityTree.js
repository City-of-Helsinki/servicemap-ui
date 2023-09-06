const initialState = {
  services: [],
  selected: [],
  opened: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MOBILITY_TREE':
      return {
        ...state,
        ...action.mobilityTree,
      };
    default:
      return state;
  }
};
