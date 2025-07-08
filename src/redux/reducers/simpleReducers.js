const basicReducer = (state, action, prefix) => {
  switch (action.type) {
    case `${prefix}_SET_SELECTION`:
      return action.selection;
    default:
      return state;
  }
};

// Map
export const mapRef = (state = null, action) =>
  basicReducer(state, action, 'MAPREF');
export const bounds = (state = null, action) =>
  basicReducer(state, action, 'BOUNDS');
export const measuringMode = (state = false, action) =>
  basicReducer(state, action, 'MEASURING_MODE');
// Sort
export const direction = (state = 'desc', action) =>
  basicReducer(state, action, 'DIRECTION');
export const order = (state = 'alphabetical', action) =>
  basicReducer(state, action, 'ORDER');
