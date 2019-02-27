export const fetchHasErrored = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
};
export const fetchIsLoading = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
};
export const units = (state = [], action) => {
  switch (action.type) {
    case 'UNITS_FETCH_DATA_SUCCESS':
      return action.units;
    default:
      return state;
  }
};

export const filter = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
};
