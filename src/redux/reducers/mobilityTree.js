const initialState = {
  services: [],
  selected: [],
  opened: [],
};

const mobilityTreeReducer = (state = initialState, action) => {
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

export default mobilityTreeReducer;
