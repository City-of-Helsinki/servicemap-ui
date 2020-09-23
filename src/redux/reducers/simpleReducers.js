const basicReducer = (state, action, prefix) => {
  switch (action.type) {
    case `${prefix}_SET_SELECTION`:
      return action.selection;
    default:
      return state;
  }
};

// Map
export const mapRef = (state = null, action) => basicReducer(state, action, 'MAPREF');
export const measuringMode = (state = false, action) => basicReducer(state, action, 'MEASURING_MODE');
// Sort
export const direction = (state = 'desc', action) => basicReducer(state, action, 'DIRECTION');
export const order = (state = 'match', action) => basicReducer(state, action, 'ORDER');
// Settings toggling
export const settingsToggled = (state = null, action) => basicReducer(state, action, 'SETTINGS_TOGGLE');
