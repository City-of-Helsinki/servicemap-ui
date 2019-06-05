const initialState = {
  isFetching: false,
  error: null,
  data: { events: null, unit: null },
  selected: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_EVENT':
      return {
        ...state,
        selected: action.event,
      };
    case 'EVENTS_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
      };
    case 'EVENTS_FETCH_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case 'EVENTS_FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: { events: action.events, unit: action.unitId },
        isFetching: false,
      };
    default:
      return state;
  }
};
