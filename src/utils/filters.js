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

export const filterCities = (cities, onlyUnits = false) => unit => cities.length === 0 || !unit.municipality || (!onlyUnits && unit.object_type !== 'unit') || cities.includes(unit.municipality);

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address'];
  if (allowedTypes.includes(obj.object_type)) {
    return true;
  }
  return false;
};
