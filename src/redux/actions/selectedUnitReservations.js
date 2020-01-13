import { reservations } from './fetchDataActions';
import { reservationsFetch } from '../../utils/fetch';

const {
  setNewData, isFetching, isFetchingMore, fetchSuccess, fetchMoreSuccess, fetchError,
} = reservations;

// Change selected unit's reservations
export const changeReservations = (data, meta) => async (dispatch) => {
  dispatch(setNewData(data, meta));
};

export const fetchReservations = (id, pageSize, more) => async (dispatch) => {
  const onStart = () => dispatch(more ? isFetchingMore() : isFetching());
  const onSuccess = (data) => {
    dispatch(fetchSuccess(data.results, { count: data.count, next: data.next }));
  };
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  reservationsFetch({ unit: `tprek:${id}`, page_size: pageSize || 5 }, onStart, onSuccess, onError);
};


export const fetchAdditionalReservations = next => async (dispatch) => {
  // fetch additional data that is added to previous data
  const onStart = () => dispatch(isFetchingMore());
  const onSuccess = (data) => {
    dispatch(fetchMoreSuccess(data.results, { count: data.count, next: data.next }));
  };
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  reservationsFetch(null, onStart, onSuccess, onError, null, null, null, next);
};
