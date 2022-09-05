import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';

const createSuggestions = (
  query,
  abortController,
  getLocaleText,
  citySettings,
) => async () => {
  const smAPI = new ServiceMapAPI();
  smAPI.setAbortController(abortController);

  const unitLimit = 10;
  const serviceLimit = 10;
  const addressLimit = 1;
  const servicenodeLimit = 10;
  const pageSize = unitLimit + serviceLimit + addressLimit + servicenodeLimit;

  const additionalOptions = {
    page_size: pageSize,
    limit: 2000,
    unit_limit: unitLimit,
    service_limit: serviceLimit,
    address_limit: addressLimit,
    servicenode_limit: servicenodeLimit,
    municipality: citySettings.join(','),
  };

  const results = await smAPI.search(query, additionalOptions);

  let filteredResults = results;

  // Filter services with city settings
  if (citySettings.length) {
    filteredResults = filteredResults.filter((result) => {
      if (result.object_type === 'service' || result.object_type === 'servicenode') {
        let totalResultCount = 0;
        citySettings.forEach((city) => {
          if (result.unit_count?.municipality[city]) {
            totalResultCount += result.unit_count.municipality[city];
          }
        });
        if (totalResultCount === 0) return false;
      }
      return true;
    });
  }


  // Handle address results
  filteredResults.forEach((item) => {
    if (item.object_type === 'address') {
      if (getLocaleText(item.name).toLowerCase() !== query.toLowerCase()) {
        item.name = item.street.name;
      } else {
        const exactAddress = { ...item };
        exactAddress.isExact = true;
        filteredResults.push(exactAddress);
      }
    }
  });

  return filteredResults;
};

export default createSuggestions;
