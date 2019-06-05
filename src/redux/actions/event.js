import config from '../../../config';

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
  const { events } = config;
  const url = events.api_url;

  dispatch(fetchIsLoading());
  try {
    const response = await fetch(`${url}event/?type=event&start=today&sort=start_time&include=location&location=tprek:${unitId}`);

    if (response.ok && response.status === 200) {
      const events = await response.json();
      dispatch(eventFetchDataSuccess(events.data, unitId));
    } else {
      throw Error(response.statusText);
    }
  } catch (e) {
    dispatch(fetchHasErrored(e.message));
  }
};

export const changeSelectedEvent = event => async (dispatch) => {
  dispatch(setSelectedEvent(event));
};
