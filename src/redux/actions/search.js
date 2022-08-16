import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { searchResults } from './fetchDataActions';

// Actions
const { isFetching, fetchSuccess, fetchProgressUpdate } = searchResults;

const stringifySearchQuery = (data) => {
  try {
    const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
    return search.join(',');
  } catch (e) {
    return '';
  }
};

const smFetch = (dispatch, options) => {
  let results = [];
  const smAPI = new ServiceMapAPI();

  const onProgressUpdate = (total, max) => {
    dispatch(fetchProgressUpdate(total, max));
  };

  if (options.q) {
    const { q, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.search(options.q, additionalOptions);
  } else if (options.serviceId) {
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.serviceUnits(options.serviceId);
  } else if (options.service_node) {
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.serviceNodeSearch(options.service_node);
  }

  return results;
};


const fetchSearchResults = (options = null) => async (dispatch, getState) => {
  const stateSearchResults = getState().searchResults;
  const { locale } = getState().user;

  if (stateSearchResults.isFetching) {
    throw Error('Unable to fetch search results because previous fetch is still active');
  }

  options.language = locale;

  const searchQuery = options.q ? options.q : stringifySearchQuery(options);
  dispatch(isFetching(searchQuery));

  const results = await smFetch(dispatch, options);

  if (options.q) {
    saveSearchToHistory(searchQuery, results);
  }
  if (options.service_node || options.serviceId) {
    results.forEach((item) => {
      item.object_type = 'unit';
    });
  }

  dispatch(fetchSuccess(results));
};

export default fetchSearchResults;
