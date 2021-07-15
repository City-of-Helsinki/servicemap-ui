import config from '../../../config';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { searchResults } from './fetchDataActions';

// Actions
const { isFetching, fetchSuccess, fetchProgressUpdate } = searchResults;

// TODO move this somewhere global if used also in unit.js
const stringifySearchQuery = (data) => {
  try {
    const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
    return search.join(',');
  } catch (e) {
    return '';
  }
};

const smFetch = (dispatch, options) => {
  let results;
  const smAPI = new ServiceMapAPI();

  const onNext = (total, max) => {
    dispatch(fetchProgressUpdate(total, max));
  };

  if (options.q) {
    smAPI.setOnNext(onNext);
    results = smAPI.search(options.q);
  }

  return results;
};

const eventsFetch = async (dispatch, options) => {
  if (options.q) {
    // TODO: maybe handle this fetch better
    const res = await fetch(`${config.eventsAPI.root}/search/?type=event&page_size=100&start=today&sort=end_time&include=location,location.id&input=${options.q}`);
    return res.json();
  }
  return null;
};


const fetchSearchResults = (options = null) => async (dispatch, getState) => {
  const { stateSearchResults } = getState();
  if (stateSearchResults.isFetching) {
    throw Error('Unable to fetch search results because previous fetch is still active');
  }

  const searchQuery = options.q ? options.q : stringifySearchQuery(options);
  dispatch(isFetching(searchQuery));

  // Fetch from servicemap API and linked events API
  const results = await Promise.all([
    smFetch(dispatch, options),
    eventsFetch(dispatch, options),
  ]);

  // Add object type to events
  const eventResults = results[1].data;
  eventResults.forEach((unit) => {
    unit.object_type = 'event';
  });

  const combinedResults = [...results[0], ...eventResults];

  dispatch(fetchSuccess(combinedResults));
};

export default fetchSearchResults;
