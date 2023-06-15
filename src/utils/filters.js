import { getUnitCount } from './units';

export const filterEmptyServices = cities => (obj) => {
  if (!obj || obj.object_type !== 'service' || !obj.unit_count) {
    return true;
  }
  if (obj.unit_count.total === 0) {
    return false;
  }
  if (!cities.length) {
    return true;
  }

  return cities.some(city => getUnitCount(obj, city) > 0);
};

export const filterCitiesAndOrganizations = (
  cities = [], organizations = [], onlyUnits = false,
) => (result) => {
  if (onlyUnits && result.object_type !== 'unit') return false;

  const resultMunicipality = result.municipality?.id || result.municipality;
  const resultDepartment = result.department?.id;
  const resultRootDepartment = result.root_department?.id;

  const cityMatch = cities.length === 0
    || (cities.includes(resultMunicipality));

  const organizationMatch = organizations.length === 0
    || (organizations.includes(resultDepartment))
    || (organizations.includes(resultRootDepartment));

  return cityMatch && organizationMatch;
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
