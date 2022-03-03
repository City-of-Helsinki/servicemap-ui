// TODO: need city (and locale?) parameters to new search fetch

import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';

const createSuggestions = (query, abortController, getLocaleText) => async () => {
  const smAPI = new ServiceMapAPI();
  smAPI.setAbortController(abortController);

  const additionalOptions = {
    page_size: 10,
    limit: 2000,
    unit_limit: 5,
    service_limit: 2,
    address_limit: 1,
  };

  const results = await smAPI.search(query, additionalOptions);

  // Handle address results
  results.forEach((item) => {
    if (item.object_type === 'address') {
      if (getLocaleText(item.name).toLowerCase() === query.toLowerCase()) {
        item.isExact = true;
      }
    }
  });

  return results;
};

export default createSuggestions;
