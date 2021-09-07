import { eventsFetch, searchFetch, unitsFetch } from '../../utils/fetch';
import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import { units } from './fetchDataActions';
import config from '../../../config';

// Actions
const {
  isFetching, fetchSuccess, fetchError, fetchProgressUpdate, setNewData,
} = units;

// Thunk fetch
export const fetchUnits = (
  // searchQuery = null,
  options = null,
) => async (dispatch, getState) => {
  const { units, user } = getState();
  const { locale } = user;
  const { searchTimeout } = config;

  const timeout = searchTimeout;
  const abortController = new AbortController();
  const fetchTimeout = setTimeout(() => {
    console.warn(`Search fetch aborted: Timeout after ${searchTimeout / 1000} seconds`);
    abortController.abort();
  }, timeout);

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
    if (results) {
      clearTimeout(fetchTimeout);
      if (options.q) {
        saveSearchToHistory(searchQuery, results);
      } else {
        results.forEach((unit) => {
          unit.object_type = 'unit';
        });
      }
      dispatch(fetchSuccess(results));
    } else {
      dispatch(fetchError('Unit fetch failed'));
    }
  };

  const onSuccessEvents = (results) => {
    clearTimeout(fetchTimeout);
    results.forEach((event) => {
      event.object_type = 'event';
      const eventUnit = event.location;
      if (eventUnit) {
        eventUnit.object_type = 'unit';
        if (typeof eventUnit.id === 'string') {
          eventUnit.id = parseInt(eventUnit.id.match(/[0-9]+/g), 10);
        }
      }
    });

    dispatch(fetchSuccess(results));
  };

  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => {
    clearTimeout(fetchTimeout);
    const max = response.count || response.meta?.count;
    dispatch(fetchProgressUpdate(resultTotal.length, max));
  };

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
  } else if (data.events) {
    eventsFetch(
      { keyword: data.events },
      onStart,
      onSuccessEvents,
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
