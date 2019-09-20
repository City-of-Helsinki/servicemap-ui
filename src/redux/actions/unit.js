import { searchFetch, nodeFetch } from '../../utils/fetch';
import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';

export const fetchHasErrored = errorMessage => ({
  type: 'UNITS_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = search => ({
  type: 'UNITS_IS_FETCHING',
  search,
});
export const unitsFetchDataSuccess = units => ({
  type: 'UNITS_FETCH_DATA_SUCCESS',
  units,
});
export const unitsFetchProgressUpdate = (count, max) => ({
  type: 'UNITS_FETCH_PROGRESS_UPDATE',
  count,
  max,
});
export const setUnitData = data => ({
  type: 'SET_NEW_UNITS',
  data,
});

// Thunk fetch
export const fetchUnits = (
  searchQuery = null,
  searchType = null,
  abortController = null,
) => async (dispatch)
=> {
  const onStart = () => dispatch(fetchIsLoading(searchQuery));
  const onSuccess = (results) => {
    // Filter out duplicate units
    const distinctData = Array.from(new Set(results.map(x => x.id))).map((id) => {
      const obj = results.find(s => id === s.id);
      return obj;
    });
    saveSearchToHistory(searchQuery, distinctData);
    dispatch(unitsFetchDataSuccess(distinctData));
  };
  const onSuccessNode = (results) => {
    results.forEach((unit) => {
      // eslint-disable-next-line no-param-reassign
      unit.object_type = 'unit';
    });
    dispatch(unitsFetchDataSuccess(results));
  };
  const onError = e => dispatch(fetchHasErrored(e.message));
  const onNext = (resultTotal, response) => dispatch(
    unitsFetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  if (searchType === 'node') {
    nodeFetch({ service_node: searchQuery }, onStart, onSuccessNode, onError, onNext, null, abortController);
  } else {
    searchFetch({ q: searchQuery }, onStart, onSuccess, onError, onNext, null, abortController);
  }
};

export const setNewSearchData = data => async (dispatch) => {
  if (data) {
    dispatch(setUnitData(data));
  }
};
