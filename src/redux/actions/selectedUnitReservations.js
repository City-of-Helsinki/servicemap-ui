import { reservationsFetch } from '../../utils/fetch';
import { reservations } from './fetchDataActions';

const { isFetching, fetchSuccess, fetchError } = reservations;

export const fetchReservations = (id) => async (dispatch, getState) => {
  const onStart = () => {
    dispatch(isFetching(id));
  };

  const onSuccess = (data) => {
    if (data && data.length) {
      dispatch(fetchSuccess(data));
      return;
    }
    dispatch(
      fetchSuccess(data.results, { count: data.count, next: data.next })
    );
  };

  const onError = (e) => {
    console.error(e); // Log the error
    dispatch(fetchError(e.message));
  };

  try {
    await reservationsFetch(
      null,
      onStart,
      onSuccess,
      onError,
      null,
      id,
      null,
      null,
      null
    );
  } catch (e) {
    onError(e);
  }
};
