export const setNavigatorRef = (ref) => (dispatch) =>
  dispatch({
    type: 'SET_NAVIGATOR_REF',
    ref,
  });

export default setNavigatorRef;
