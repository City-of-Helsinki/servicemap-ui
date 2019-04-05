export const setFilter = (key, value) => ({
  type: 'SET_FILTER',
  filter: { key, value },
});

export const setSelectedUnit = id => ({
  type: 'SET_SELECTED_UNIT_FILTER',
  filter: id,
});

export const changeSelectedUnit = unitId => async (dispatch) => {
  // Turn string to int
  const parsedId = typeof unitId === 'string' ? parseInt(unitId, 10) : unitId;
  dispatch(setSelectedUnit(parsedId));
};
