import { reservations } from './fetchDataActions';
import { reservationsFetch } from '../../utils/fetch';

const {
  isFetching, fetchSuccess, fetchMoreSuccess, fetchError, fetchProgressUpdate,
} = reservations;

export const fetchReservations = (id, pageSize, all = false) => async (dispatch) => {
  const onStart = () => {
    dispatch(isFetching());
  };
  const onSuccess = (data) => {
    if (data && data.length) {
      dispatch(fetchSuccess(data));
      return;
    }
    dispatch(fetchProgressUpdate(data.results.length, data.count, data.next));
    dispatch(fetchSuccess(data.results, { count: data.count, next: data.next }));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = all ? (resultTotal, response) => {
    dispatch(fetchProgressUpdate(resultTotal.length, response.count));
  } : null;

  // Fetch data
  reservationsFetch({ unit: `tprek:${id}`, page_size: pageSize || 5 }, onStart, onSuccess, onError, onNext);
};


export const fetchAdditionalReservations = next => async (dispatch) => {
  // fetch additional data that is added to previous data
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    dispatch(fetchMoreSuccess(data.results, { count: data.count, next: data.next }));
  };
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  reservationsFetch(null, onStart, onSuccess, onError, null, null, null, next);
};
