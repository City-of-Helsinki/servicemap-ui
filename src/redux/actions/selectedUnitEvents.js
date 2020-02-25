import { events } from './fetchDataActions';
import { unitEventsFetch } from '../../utils/fetch';

const {
  setNewData, isFetching, fetchSuccess, fetchError, fetchProgressUpdate,
} = events;

export const changeUnitEvents = (events, meta) => async (dispatch) => {
  dispatch(setNewData(events, meta));
};

export const fetchUnitEvents = (unitId, pageSize, all = false) => async (dispatch) => {
  const onStart = () => {
    dispatch(isFetching());
  };
  const onSuccess = (data) => {
    if (data && data.length) {
      dispatch(fetchSuccess(data));
      return;
    }
    if (data.data && data.meta) {
      dispatch(fetchProgressUpdate(data.data.length, data.meta.count, data.meta.next));
      dispatch(fetchSuccess(data.data));
    }
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = all ? (resultTotal, response) => {
    dispatch(fetchProgressUpdate(resultTotal.length, response.meta.count));
  } : null;

  // Fetch data
  unitEventsFetch({ location: `tprek:${unitId}`, page_size: pageSize || 5 }, onStart, onSuccess, onError, onNext);
};
