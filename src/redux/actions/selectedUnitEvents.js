import { events } from './fetchDataActions';
import { unitEventsFetch } from '../../utils/fetch';

const {
  setNewData, isFetching, fetchSuccess, fetchError,
} = events;

export const changeUnitEvents = events => async (dispatch) => {
  dispatch(setNewData(events));
};

export const fetchUnitEvents = unitId => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = data => dispatch(fetchSuccess(data.data));
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  unitEventsFetch({ location: `tprek:${unitId}` }, onStart, onSuccess, onError);
};
