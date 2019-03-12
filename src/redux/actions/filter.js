export const setFilter = (key, value) => ({
  type: 'SET_FILTER',
  filter: { key, value },
});

export const setSelectedUnit = id => ({
  type: 'SET_SELECTED_UNIT_FILTER',
  filter: id,
});
