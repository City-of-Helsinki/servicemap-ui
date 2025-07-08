const initialState = null;

const navigatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NAVIGATOR_REF':
      return action.ref;
    default:
      return state;
  }
};

export default navigatorReducer;
