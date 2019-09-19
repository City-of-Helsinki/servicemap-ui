import { unitEventsFetch } from '../../utils/fetch';

export const fetchIsLoading = () => ({
  type: 'EVENTS_IS_FETCHING',
});
export const fetchHasErrored = error => ({
  type: 'EVENTS_FETCH_HAS_ERRORED',
  error,
});
export const eventFetchDataSuccess = (events, unitId) => ({
  type: 'EVENTS_FETCH_DATA_SUCCESS',
  events,
  unitId,
});

export const setSelectedEvent = event => ({
  type: 'SET_SELECTED_EVENT',
  event,
});

export const fetchUnitEvents = unitId => async (dispatch) => {
  const onStart = () => dispatch(fetchIsLoading());
  const onSuccess = data => dispatch(eventFetchDataSuccess(data.data, unitId));
  const onError = e => dispatch(fetchHasErrored(e.message));

  // Fetch data
  unitEventsFetch({ location: `tprek:${unitId}` }, onStart, onSuccess, onError);
};

export const changeSelectedEvent = event => async (dispatch) => {
  dispatch(setSelectedEvent(event));
};
