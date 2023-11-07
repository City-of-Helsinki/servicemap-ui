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

const isOrganizationMatch = (result, organizationIds) => {
  if (organizationIds.length === 0) {
    return true;
  }
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

  return organizationIds.includes(resultDepartment)
    || organizationIds.includes(resultRootDepartment);
};

export const filterCitiesAndOrganizations = (
  cities = [], organizationIds = [], onlyUnits = false,
) => (result) => {
  if (onlyUnits && result.object_type !== 'unit') return false;
  // Services are not filtered by cities or organizations
  if (['service', 'servicenode'].includes(result.object_type)) return true;

  const resultMunicipality = result.municipality?.id || result.municipality;

  const cityMatch = cities.length === 0
    || (cities.includes(resultMunicipality));

  // Addresses are not filtered by organizations
  if (result.object_type === 'address') return cityMatch;

  return cityMatch && isOrganizationMatch(result, organizationIds);
};

/**
 * Creates a filter that filters by municipality against citySettings
 * @param citySettings given by state with selectCities
 * @param getter access to municipality data, defaults to y => y.municipality
 * @returns filter that checks for municipality
 */
export const filterByCitySettings = (citySettings, getter = y => y.municipality) => {
  const selectedCities = Object.keys(citySettings).filter(city => citySettings[city]);
  if (!selectedCities.length) {
    return () => true;
  }
  return x => citySettings[getter(x)];
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
