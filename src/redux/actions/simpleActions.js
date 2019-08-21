const setSelection = (prefix, selection) => ({
  type: `${prefix}_SET_SELECTION`,
  selection,
});

export default setSelection;
