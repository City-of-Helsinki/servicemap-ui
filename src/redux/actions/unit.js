import queryBuilder from '../../utils/queryBuilder';
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
  allData = [],
  next = null,
  searchQuery = null,
) => async (dispatch, getState)
=> {
  const { units } = getState();
  const { isFetching } = units;

  // If not currently fetching init fetch
  if (!isFetching) {
    dispatch(fetchIsLoading(searchQuery));
  }

  // If getting next page or first fetch proceed to actual fetch
  if (next || !isFetching) {
    try {
      let response = null;
      if (next) {
        response = await fetch(next);
      } else {
        response = await queryBuilder.search(searchQuery).run();
      }
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      const newData = [...allData, ...data.results];
      if (data.next) {
        // Fetch the next page if response has more than one page of results
        dispatch(unitsFetchProgressUpdate(newData.length, data.count));
        dispatch(fetchUnits(newData, data.next, searchQuery));
      } else {
        // Filter out duplicate units
        const distinctData = Array.from(new Set(newData.map(x => x.id))).map((id) => {
          const obj = newData.find(s => id === s.id);
          return obj;
        });
        dispatch(unitsFetchDataSuccess(distinctData));
        saveSearchToHistory(searchQuery, distinctData);
      }
    } catch (e) {
      dispatch(fetchHasErrored(e.message));
    }
  }
};

export const setNewSearchData = data => async (dispatch) => {
  if (data) {
    dispatch(setUnitData(data));
  }
};
