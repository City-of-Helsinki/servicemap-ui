const initialState = null;

const trackerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TRACKER':
      return action.tracker;
    default:
      return state;
  }
};

export default trackerReducer;
