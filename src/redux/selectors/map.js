import { createSelector } from 'reselect';

const getMapType = store => store.mapType;
const getUnits = store => store.unitList;

// This gets units from redux and bundles units with same coordinates together
const getUnitList = createSelector(
  [getUnits],
  ((units) => {
    const result = [];

    units.forEach((unit) => {
      const duplicates = [];

      if (!unit.duplicate) {
        units.forEach((compare) => {
          if (compare !== unit && compare.lng === unit.lng && compare.lat === unit.lat) {
            const duplicateUnit = compare;
            duplicateUnit.duplicate = true;
            duplicates.push(duplicateUnit);
          }
        });
      }

      if (duplicates.length > 0) {
        const duplicateUnit = unit;
        duplicateUnit.duplicate = true;
        duplicates.push(duplicateUnit);
        result.push(duplicates);
      } else if (!unit.duplicate) {
        result.push(unit);
      }
    });
    return result;
  }),
);

export {
  getMapType,
  getUnitList,
};
