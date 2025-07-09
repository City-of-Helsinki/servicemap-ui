import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import LinkedEventsAPI from '../../utils/newFetch/LinkedEventsAPI';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { isEmbed } from '../../utils/path';
import optionsToSearchQuery from '../../utils/search';
import { getLocaleString } from '../selectors/locale';
import { selectSearchResults } from '../selectors/results';
import { getLocale } from '../selectors/user';
import { searchResults } from './fetchDataActions';

// Actions
const { isFetching, fetchSuccess, fetchProgressUpdateConcurrent } =
  searchResults;

const smFetch = (dispatch, options) => {
  let results = [];
  const smAPI = new ServiceMapAPI();

  const onProgressUpdateConcurrent = (total, max) => {
    dispatch(fetchProgressUpdateConcurrent(total, max));
  };

  if (options.q) {
    // General text search
    const { q, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdateConcurrent);
    results = smAPI.search(options.q, additionalOptions);
  } else if (options.service_id) {
    // Service fetch
    const { service_id, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdateConcurrent);
    results = smAPI.serviceUnitSearch(service_id, additionalOptions);
  } else if (options.service_node) {
    // Service  node fetch
    const { service_node, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdateConcurrent);
    results = smAPI.serviceNodeSearch(
      'ServiceTree',
      service_node,
      additionalOptions
    );
  } else if (options.mobility_node) {
    // Mobility node fetch
    const { mobility_node, ...additionalOptions } = options;
    smAPI.setOnProgressUpdate(onProgressUpdateConcurrent);
    results = smAPI.serviceNodeSearch(
      'MobilityTree',
      mobility_node,
      additionalOptions
    );
  } else if (options.address) {
    // Search units and addresses with address
    const { address, ...additionalOptions } = options;
    // Fetch units and addresses from two different endpoints
    const addressFetchOptions = { type: 'address', ...additionalOptions };
    const unitFetchOptions = { address, ...additionalOptions };
    results = Promise.all([
      smAPI.search(address, addressFetchOptions, true),
      smAPI.units(unitFetchOptions),
    ]);
  } else if (options.id) {
    const unitFetchOptions = { id: options.id };
    results = smAPI.units(unitFetchOptions);
  } else if (options.events) {
    const eventsAPI = new LinkedEventsAPI();
    results = eventsAPI.eventsByKeyword(options.events);
  } else if (options.level) {
    results = smAPI.units(options);
  }

  return results;
};

const fetchSearchResults =
  (options = null) =>
  async (dispatch, getState) => {
    const searchFetchState = selectSearchResults(getState());
    const locale = getLocale(getState());

    const searchQuery = optionsToSearchQuery(options);

    if (searchFetchState.isFetching) {
      throw Error(
        'Unable to fetch search results because previous fetch is still active'
      );
    }

    dispatch(isFetching(searchQuery));

    const extraFields = [
      'unit.connections',
      'unit.phone',
      'unit.call_charge_info',
      'unit.email',
      'unit.www',
      'unit.address_zip',
    ];
    const fetchOptions = {
      ...options,
      language: locale,
      ...(isEmbed() ? { include: extraFields } : {}),
    };
    let results = await smFetch(dispatch, fetchOptions);

    /* Handle search results */

    if (results?.length) {
      // Handle text search results
      if (options.q) {
        saveSearchToHistory(searchQuery, {
          object_type: 'searchHistory',
          text: searchQuery,
        });
      }
      // Handle unit results that have no object_type
      const keys = [
        'service_node',
        'mobility_node',
        'service_id',
        'id',
        'level',
      ];
      if (keys.some((key) => !!options[key])) {
        results.forEach((item) => {
          item.object_type = 'unit';
        });
      }
      // Handle "search with address" results
      if (options.address) {
        // If address has a number specified, we can assume it is exact address instead of street
        const isExactAddress = /\d/.test(options.address);
        let addressData = results[0];
        const unitData = results[1];
        unitData.forEach((unit) => {
          unit.object_type = 'unit';
        });
        if (isExactAddress) {
          addressData = addressData.filter(
            (res) => getLocaleString(locale, res.name) === options.address
          );
        }
        results = [...addressData, ...unitData];
      }
      // Handle event search results
      if (options.events) {
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
      }
    }

    dispatch(fetchSuccess(results));
  };

export default fetchSearchResults;
