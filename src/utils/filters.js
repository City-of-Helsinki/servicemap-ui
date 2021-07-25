/* eslint-disable camelcase */
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
  const resultMunicipality = result.municipality || result.location?.address_locality?.fi;
  return cities.length === 0
    || !resultMunicipality
    || (!onlyUnits && result.object_type !== 'unit' && result.object_type !== 'event')
    || cities.includes(resultMunicipality.toLowerCase());
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  if (allowedTypes.includes(obj.object_type)) {
    return true;
  }
  return false;
};
