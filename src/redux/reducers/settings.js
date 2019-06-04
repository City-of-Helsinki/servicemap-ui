const initialState = null;

const basicSelection = (state = initialState, action, prefix) => {
  switch (action.type) {
    case `${prefix}_SET_SELECTION`:
      return action.selection;
    default:
      return state;
  }
};

export const hearing = (state, action) => basicSelection(state, action, 'HEARING');

export const sight = (state, action) => basicSelection(state, action, 'SIGHT');

export const colorblind = (state, action) => basicSelection(state, action, 'COLORBLIND');

export const mobility = (state, action) => basicSelection(state, action, 'MOBILITY');
