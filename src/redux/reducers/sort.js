const initialDirection = 'desc';
const initialOrder = 'match';

const basicReducer = (state, action, prefix) => {
  switch (action.type) {
    case `${prefix}_SET_SELECTION`:
      return action.selection;
    default:
      return state;
  }
};

export const direction = (state = initialDirection, action) => basicReducer(state, action, 'DIRECTION');

export const order = (state = initialOrder, action) => basicReducer(state, action, 'ORDER');
