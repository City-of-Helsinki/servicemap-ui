export const setMobilityTree = mobilityTree => ({
  type: 'SET_MOBILITY_TREE',
  mobilityTree,
});

export const resetMobilityTree = () => async dispatch => {
  dispatch(setMobilityTree({ opened: [], services: [], selected: [] }));
};
