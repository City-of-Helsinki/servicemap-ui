export const setMobilityTree = (mobilityTree) => ({
  type: 'SET_MOBILITY_TREE',
  mobilityTree,
});

export const resetMobilityTreeSelections = () => async (dispatch) => {
  dispatch(setMobilityTree({ opened: [], selected: [] }));
};
