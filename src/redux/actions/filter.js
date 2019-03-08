export const setFilter = (key, value) => ({
  type: 'SET_FILTER',
  filter: { key, value },
});

export const setSelectedFilter = (id) => ({
  type: 'SET_SELECTED_FILTER',
  filter: id,
});