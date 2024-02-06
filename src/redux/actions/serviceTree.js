export const setServiceTree = serviceTree => ({
  type: 'SET_SERVICE_TREE',
  serviceTree,
});

export const resetServiceTree = () => async dispatch => {
  dispatch(setServiceTree({ opened: [], services: [], selected: [] }));
};
