import config from '../../../config';
import { alertErrors, alertNews } from './fetchDataActions';

// Thunk fetch
export const fetchNews = () => async (dispatch) => {
  // Actions
  const {
    isFetching, fetchSuccess, fetchError,
  } = alertNews;

  dispatch(isFetching());
  fetch(`${config.serviceMapAPI.root}/announcement/`)
    .then(res => res.json())
    .then(data => dispatch(fetchSuccess(data.results)))
    .catch((e) => {
      dispatch(fetchError(e.message));
      console.warn('Error fetching news data:', e);
    });
};


// Thunk fetch
export const fetchErrors = () => async (dispatch) => {
  // Actions
  const {
    isFetching, fetchSuccess, fetchError,
  } = alertErrors;

  dispatch(isFetching());
  fetch(`${config.serviceMapAPI.root}/error_message/`)
    .then(res => res.json())
    .then(data => dispatch(fetchSuccess(data.results)))
    .catch((e) => {
      dispatch(fetchError(e.message));
      console.warn('Error fetching news data:', e);
    });
};
