const initialState = false;

const basicSelection = (state = initialState, action, prefix) => {
  switch (action.type) {
    case `${prefix}_SET_SELECTION`:
      return action.selection;
    default:
      return state;
  }
};

export const hearingAid = (state, action) => basicSelection(state, action, 'HEARING');

export const visuallyImpaired = (state, action) => basicSelection(state, action, 'SIGHT');

export const colorblind = (state, action) => basicSelection(state, action, 'COLORBLIND');

export const mobility = (state, action) => basicSelection(state, action, 'MOBILITY');

export const mapType = (state, action) => basicSelection(state, action, 'MAP_TYPE');
