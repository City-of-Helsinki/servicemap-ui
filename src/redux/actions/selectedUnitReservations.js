import { reservations } from './fetchDataActions';
import { reservationsFetch } from '../../utils/fetch';

const {
  setNewData, isFetching, fetchSuccess, fetchError,
} = reservations;

// Change selected unit's reservations
export const changeReservations = data => async (dispatch) => {
  dispatch(setNewData(data));
};

export const fetchReservations = id => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    dispatch(fetchSuccess(data.results));
  };
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  reservationsFetch({ unit: `tprek:${id}` }, onStart, onSuccess, onError, null, id);
};
