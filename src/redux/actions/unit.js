import { searchFetch } from '../../utils/fetch';
import { units } from './fetchDataActions';

// Actions
const {
  isFetching, fetchSuccess, fetchError, fetchProgressUpdate, setNewData,
} = units;

// Thunk fetch
export const fetchUnits = (
  searchQuery = null,
  abortController = null,
) => async (dispatch)
=> {
  const onStart = () => dispatch(isFetching(searchQuery));
  const onSuccess = (results) => {
    dispatch(fetchSuccess(results));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => dispatch(
    fetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  searchFetch({ q: searchQuery }, onStart, onSuccess, onError, onNext, null, abortController);
};

export const setNewSearchData = data => async (dispatch) => {
  if (data) {
    dispatch(setNewData(data));
  }
};
