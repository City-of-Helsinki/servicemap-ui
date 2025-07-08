export const setServiceTree = (serviceTree) => ({
  type: 'SET_SERVICE_TREE',
  serviceTree,
});

export const resetServiceTreeSelections = () => async (dispatch) => {
  dispatch(setServiceTree({ opened: [], selected: [] }));
};
