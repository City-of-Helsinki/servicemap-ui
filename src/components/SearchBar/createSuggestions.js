// TODO: need city (and locale?) parameters to new search fetch

import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';

const createSuggestions = (query, abortController, getLocaleText, citySettings) => async () => {
  const smAPI = new ServiceMapAPI();
  smAPI.setAbortController(abortController);

  const unitLimit = 10;
  const serviceLimit = 10;
  const addressLimit = 1;
  const pageSize = unitLimit + serviceLimit + addressLimit;

  const additionalOptions = {
    page_size: pageSize,
    limit: 2000,
    unit_limit: unitLimit,
    service_limit: serviceLimit,
    address_limit: addressLimit,
    municipality: citySettings.join(','),
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
