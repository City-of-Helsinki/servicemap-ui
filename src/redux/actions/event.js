export const setSelectedEvent = (event) => ({
  type: 'SET_SELECTED_EVENT',
  event,
});

export const changeSelectedEvent = (event) => async (dispatch) => {
  dispatch(setSelectedEvent(event));
};
