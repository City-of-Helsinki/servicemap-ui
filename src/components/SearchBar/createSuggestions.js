import { filterCitiesAndOrganizations } from '../../utils/filters';
import { getUnitCount } from '../../utils/units';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';

const createSuggestions = (
  query,
  abortController,
  getLocaleText,
  citySettings,
  organizationSettings,
  locale,
) => async () => {
  const smAPI = new ServiceMapAPI();
  smAPI.setAbortController(abortController);

  const unitLimit = 10;
  const serviceLimit = 10;
  const addressLimit = 1;
  const servicenodeLimit = 10;
  const administrativeDivisionLimit = 0;
  const pageSize = unitLimit + serviceLimit + addressLimit + servicenodeLimit;

  const additionalOptions = {
    page_size: pageSize,
    unit_limit: unitLimit,
    service_limit: serviceLimit,
    address_limit: addressLimit,
    servicenode_limit: servicenodeLimit,
    administrativedivision_limit: administrativeDivisionLimit,
    language: locale,
  };

  const results = await smAPI.searchSuggestions(query, additionalOptions);

  let filteredResults = results;

  // Filter services with city settings
  if (citySettings.length) {
    filteredResults = filteredResults.filter((result) => {
      if (result.object_type === 'service' || result.object_type === 'servicenode') {
        const totalResultCount = citySettings
          .map(city => getUnitCount(result, city))
          .reduce((partial, a) => partial + a, 0);
        if (totalResultCount === 0) return false;
      }
      return true;
    });
  }

  // Filter units with city and organization settings
  filteredResults = filteredResults.filter(
    filterCitiesAndOrganizations(citySettings, organizationSettings),
  );

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
