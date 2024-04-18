/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from 'react-redux';
import config from '../../config';
import { selectSelectedCities, selectSelectedOrganizationIds } from '../redux/selectors/settings';
import { parseSearchParams } from './index';
import { getUnitCount } from './units';

const PRIVATE_ORGANIZATION_TYPES = [10, 'PRIVATE_ENTERPRISE'];

export const filterEmptyServices = (cities, organizationIds) => (obj) => {
  if (!obj || obj.object_type !== 'service' || !obj.unit_count) {
    return true;
  }
  if (obj.unit_count.total === 0) {
    return false;
  }
  if (cities.length && cities.every(city => getUnitCount(obj, city) === 0)) {
    return false;
  }
  return !organizationIds.length || !organizationIds.every(org => getUnitCount(obj, org) === 0);
};

const filterByOrganizationIds = organizationIds => {
  if (organizationIds.length === 0) {
    return () => true;
  }
  const organizationSettings = {};
  organizationIds.forEach(orgId => {
    organizationSettings[orgId] = true;
  });
  return result => {
    // There are organizations so we filter by organization
    const contractTypeId = result.contract_type?.id;
    // we do not want NOT_DISPLAYED services
    if (contractTypeId === 'NOT_DISPLAYED') {
      return false;
    }
    // we do not want private services
    if (contractTypeId === 'PRIVATE_SERVICE' || PRIVATE_ORGANIZATION_TYPES.includes(result.organizer_type)) {
      return false;
    }
    const resultDepartment = result.department?.id || result.department;
    const resultRootDepartment = result.root_department?.id || result.root_department;

    return organizationSettings[resultDepartment] || organizationSettings[resultRootDepartment];
  };
};

/**
 * Creates a filter that filters by municipality against citySettings
 * @param citySettings given by state with selectCities
 * @param getter access to municipality data, defaults to y => y.municipality
 * @returns filter that checks for municipality
 */
export const filterByCitySettings = (citySettings, getter = y => y.municipality) => {
  // This is a bit defensive to go with config.cities
  const selectedCities = config.cities.filter(city => citySettings[city]);
  if (!selectedCities.length) {
    return () => true;
  }
  const allowedCitySettings = {};
  selectedCities.forEach(city => {
    allowedCitySettings[city] = true;
  });
  return x => allowedCitySettings[getter(x)];
};

/**
 * Creates a filter that filters by municipality against cities. This uses logic of
 * filterByCitySettings.
 * @param cities list of cities
 * @param getter access to municipality data, defaults to y => y.municipality
 * @returns filter that checks for municipality
 */
export const filterByCities = (cities, getter = y => y.municipality) => {
  const citySettings = {};
  cities.forEach(city => {
    citySettings[city] = true;
  });
  return filterByCitySettings(citySettings, getter);
};

export const filterCitiesAndOrganizations = (
  cities = [], organizationIds = [], onlyUnits = false,
) => {
  const getter = result => result.municipality?.id || result.municipality;
  const cityFilter = filterByCities(cities, getter);
  const organizationFilter = filterByOrganizationIds(organizationIds);
  return result => {
    if (onlyUnits && result.object_type !== 'unit') return false;
    // Services are not filtered by cities or organizations
    if (['service', 'servicenode'].includes(result.object_type)) return true;

    // Addresses are not filtered by organizations
    if (result.object_type === 'address') return cityFilter(result);

    return cityFilter(result) && organizationFilter(result);
  };
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};

/**
 * Helper that resolves the city settings that should be used for filtering. If embedded then use
 * cities from location ('city' url param). If not embed then use usual city settings
 * @param citySettings from state.settings.cities
 * @param location object given by react-router-dom
 * @param embed state of embedding
 * @returns citySettings type of object
 */
export const resolveCitySettings = (citySettings, location, embed) => {
  if (!embed) {
    return citySettings;
  }
  const cities = parseSearchParams(location.search)?.city?.split(',') || [];
  const urlCitySettings = {};
  cities.forEach(city => {
    urlCitySettings[city] = true;
  });
  return urlCitySettings;
};

/**
 * Helper that resolves the filter to use based on embed state and if embedded then cities and org
 * ids are parsed from location.
 * @param cities from state.settings.cities
 * @param organizationIds from state.settings.cities
 * @param location object given by react-router-dom
 * @param embed state of embedding
 * @returns filter predicate
 */
export const resolveCityAndOrganizationFilter = (cities, organizationIds, location, embed) => {
  if (!embed) {
    return filterCitiesAndOrganizations(cities, organizationIds);
  }
  const splitByComma = text => ((text?.length || 0) === 0 ? [] : text?.split(',')) || [];
  const searchParam = parseSearchParams(location.search);
  const cityParam = searchParam?.city || searchParam?.municipality;
  const cityArray = splitByComma(cityParam);
  const orgIdArray = splitByComma(searchParam?.organization);
  return filterCitiesAndOrganizations(cityArray, orgIdArray);
};

/**
 * Helper to wrap city and org filtering logic.
 */
export const applyCityAndOrganizationFilter = (units, location, embed) => {
  const cities = useSelector(selectSelectedCities);
  const orgIds = useSelector(selectSelectedOrganizationIds);
  const cityAndOrgFilter = resolveCityAndOrganizationFilter(cities, orgIds, location, embed);
  return units.filter(cityAndOrgFilter);
};

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} cities - selected cities
 * @param {*} organizationIds - selected organization ids
 */
export const getCityAndOrgFilteredData = (data, cities, organizationIds) => data
  .filter(filterResultTypes())
  .filter(filterEmptyServices(cities, organizationIds))
  .filter(filterCitiesAndOrganizations(cities, organizationIds));
