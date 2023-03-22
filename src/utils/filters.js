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

export const filterCities = (cities, onlyUnits = false) => (result) => {
  const resultMunicipality = result.municipality?.id || result.municipality;
  // Wellbeing area settings are checked with department values
  const resultDepartment = result.department?.id;
  const resultRootDepartment = result.root_department?.id;

  return (cities.length === 0)
    || (!(resultMunicipality || resultDepartment || resultRootDepartment))
    || (onlyUnits && result.object_type === 'unit')
    || (cities.includes(resultMunicipality))
    || (cities.includes(resultDepartment))
    || (cities.includes(resultRootDepartment));
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
