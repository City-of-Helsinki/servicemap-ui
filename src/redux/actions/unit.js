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
    // Filter out duplicate units
    const distinctData = Array.from(new Set(results.map(x => x.id))).map((id) => {
      const obj = results.find(s => id === s.id);
      return obj;
    });
    dispatch(fetchSuccess(distinctData));
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
