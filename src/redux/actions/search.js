import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { getLocaleString } from '../selectors/locale';
import { searchResults } from './fetchDataActions';

// Actions
const {
  isFetching, fetchSuccess, fetchProgressUpdateConcurrent,
} = searchResults;


const smFetch = (dispatch, options) => {
  let results = [];
  const smAPI = new ServiceMapAPI();

  const onProgressUpdate = (total, max) => {
    dispatch(fetchProgressUpdateConcurrent(total, max));
  };

  if (options.q) { // General text search
    const { q, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.search(options.q, additionalOptions);
  } else if (options.service_id) { // Service fetch
    const { service_id, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.serviceUnitSearch(service_id, additionalOptions);
  } else if (options.service_node) { // Service  node fetch
    const { service_node, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdate);
    results = smAPI.serviceNodeSearch(service_node, additionalOptions);
  } else if (options.address) { // Search units and addresses with address
    const { address, ...additionalOptions } = options;
    // Fetch units and addresses from two different endpoints
    const addressFetchOptions = { type: 'address', ...additionalOptions };
    const unitFetchOptions = { address, ...additionalOptions };
    results = Promise.all([
      smAPI.search(address, addressFetchOptions, true),
      smAPI.units(unitFetchOptions),
    ]);
  }

  return results;
};


const fetchSearchResults = (options = null) => async (dispatch, getState) => {
  const searchFetchState = getState().searchResults;
  const { locale } = getState().user;

  const searchQuery = options.q || options.address || options.service_node || options.service_id;

  if (searchFetchState.isFetching) {
    throw Error('Unable to fetch search results because previous fetch is still active');
  }

  dispatch(isFetching(searchQuery));

  const fetchOptions = { ...options, language: locale };
  let results = await smFetch(dispatch, fetchOptions);

  /* Handle search results */

  if (results?.length) {
    // Handle text search results
    if (options.q) {
      saveSearchToHistory(searchQuery, { object_type: 'searchHistory', text: searchQuery });
    }
    // Handle service and sercice node results
    if (options.service_node || options.service_id) {
      results.forEach((item) => {
        item.object_type = 'unit';
      });
    }
    // Handle "search with address" results
    if (options.address) {
      const isExactAddress = /\d/.test(options.address); // If address has a number specified, we can assume it is exact address instead of street
      let addressData = results[0];
      const unitData = results[1];
      unitData.forEach((unit) => { unit.object_type = 'unit'; });
      if (isExactAddress) {
        addressData = addressData.filter(
          res => getLocaleString(locale, res.name) === options.address,
        );
      }
      results = [...addressData, ...unitData];
    }
  }

  dispatch(fetchSuccess(results));
};

export default fetchSearchResults;
