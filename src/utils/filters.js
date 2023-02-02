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

  let hasUnits = false;
  cities.forEach((city) => {
    if (hasUnits) {
      return;
    }
    const { municipality } = obj.unit_count;
    if (municipality) {
      const unitCount = municipality[city];
      if (unitCount) {
        hasUnits = true;
      }
    }
  });

  return hasUnits;
};

export const filterCities = (cities, onlyUnits = false) => (result) => {
  const resultMunicipality = result.municipality?.id || result.municipality;
  const resultDepartmentId = result.department?.id;
  return (cities.length === 0)
    || (!resultMunicipality && !resultDepartmentId)
    || (onlyUnits && result.object_type === 'unit')
    || (cities.includes(resultMunicipality) || (cities.includes(resultDepartmentId)));
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
