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

export const helsinki = (state, action) => basicSelection(state, action, 'HELSINKI');

export const espoo = (state, action) => basicSelection(state, action, 'ESPOO');

export const vantaa = (state, action) => basicSelection(state, action, 'VANTAA');

export const kauniainen = (state, action) => basicSelection(state, action, 'KAUNIAINEN');
