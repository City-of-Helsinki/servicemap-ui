const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TRACKER':
      return action.tracker;
    default:
      return state;
  }
};
