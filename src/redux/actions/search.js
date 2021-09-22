import config from '../../../config';
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

  const onNext = (total, max) => {
    dispatch(fetchProgressUpdate(total, max));
  };

  smAPI.setOnNext(onNext);

  if (options.q) {
    results = smAPI.search(options.q);
  } else if (options.service_node) {
    results = smAPI.serviceNodeSearch(options.service_node);
  }

  return results;
};

const eventsFetch = async (options) => {
  if (options.q) {
    const res = await fetch(`${config.eventsAPI.root}/search/?type=event&page_size=100&start=today&sort=end_time&include=location,location.id&input=${options.q}`);
    return res.json();
  } if (options.events) {
    const res = await fetch(`${config.eventsAPI.root}/event/?type=event&page_size=100&start=today&sort=end_time&include=location,location.id&keyword=${options.events}`);
    return res.json();
  }
  return null;
};


const fetchSearchResults = (options = null) => async (dispatch, getState) => {
  const stateSearchResults = getState().searchResults;
  if (stateSearchResults.isFetching) {
    throw Error('Unable to fetch search results because previous fetch is still active');
  }

  const searchQuery = options.q ? options.q : stringifySearchQuery(options);
  dispatch(isFetching(searchQuery));

  // Fetch from servicemap API and linked events API
  const results = await Promise.all([
    smFetch(dispatch, options),
    eventsFetch(options),
  ]);

  if (options.service_node) {
    results[0].forEach((unit) => {
      unit.object_type = 'unit';
    });
  }

  // Add object type to events
  const eventResults = results[1]?.data || [];
  eventResults.forEach((unit) => {
    unit.object_type = 'event';
  });

  const combinedResults = [...results[0], ...eventResults];

  dispatch(fetchSuccess(combinedResults));
};

export default fetchSearchResults;
