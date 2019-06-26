const setSelection = (prefix, selection) => ({
  type: `${prefix}_SET_SELECTION`,
  selection,
});

export const setDirection = value => setSelection('DIRECTION', value);

export const setOrder = value => setSelection('ORDER', value);
