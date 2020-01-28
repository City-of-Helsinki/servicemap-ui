const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_EVENT':
      return action.event;
    default:
      return state;
  }
};
