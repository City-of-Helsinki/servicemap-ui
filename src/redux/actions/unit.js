import { searchFetch, unitsFetch } from '../../utils/fetch';
import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import { units } from './fetchDataActions';

// Actions
const {
  isFetching, fetchSuccess, fetchError, fetchProgressUpdate, setNewData,
} = units;

// Thunk fetch
export const fetchUnits = (
  // searchQuery = null,
  options = null,
  abortController = null,
) => async (dispatch, getState) => {
  const { units, user } = getState();
  const { locale } = user;
  if (units.isFetching) {
    throw Error('Unable to fetch units because previous fetch is still active');
  }
  const stringifySearchQuery = (data) => {
    try {
      const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
      return search.join(',');
    } catch (e) {
      return '';
    }
  };
  const searchQuery = options.q ? options.q : stringifySearchQuery(options);
  const onStart = () => dispatch(isFetching(searchQuery));

  const onSuccess = (results) => {
    if (options.q) {
      saveSearchToHistory(searchQuery, results);
    } else {
      results.forEach((unit) => {
        // eslint-disable-next-line no-param-reassign
        unit.object_type = 'unit';
      });
    }
    dispatch(fetchSuccess(results));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => dispatch(
    fetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  const data = options;
  if (data.q) {
    data.language = options.search_language || locale || 'fi';
    searchFetch(
      data,
      onStart,
      onSuccess,
      onError,
      onNext,
      null,
      abortController,
    );
  } else {
    unitsFetch(
      data,
      onStart,
      onSuccess,
      onError,
      onNext,
      null,
      abortController,
    );
  }
};

export const setNewSearchData = data => async (dispatch) => {
  if (data) {
    dispatch(setNewData(data));
  }
};
