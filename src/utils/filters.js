import { getUnitCount } from './units';

export const filterEmptyServices = (cities, organizations) => (obj) => {
  if (!obj || obj.object_type !== 'service' || !obj.unit_count) {
    return true;
  }
  if (obj.unit_count.total === 0) {
    return false;
  }
  if (!cities.length && !organizations.length) {
    return true;
  }
  const unitsByCity = cities.length
    ? cities.some(city => getUnitCount(obj, city) > 0)
    : true;
  const unitsByOrg = organizations.length
    ? organizations.some(org => getUnitCount(obj, org) > 0)
    : true;

  return unitsByCity && unitsByOrg;
};

export const filterCitiesAndOrganizations = (
  cities = [], organizations = [], onlyUnits = false,
) => (result) => {
  if (onlyUnits && result.object_type !== 'unit') return false;
  // Services are not filtered by cities or organizations
  if (['service', 'servicenode'].includes(result.object_type)) return true;

  const resultMunicipality = result.municipality?.id || result.municipality;
  const resultDepartment = result.department?.id || result.department;
  const resultRootDepartment = result.root_department?.id || result.root_department;

  const cityMatch = cities.length === 0
    || (cities.includes(resultMunicipality));

  // Addresses are not filtered by organizations
  if (result.object_type === 'address') return cityMatch;

  const organizationMatch = organizations.length === 0
    || (organizations.includes(resultDepartment))
    || (organizations.includes(resultRootDepartment));

  return cityMatch && organizationMatch;
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
