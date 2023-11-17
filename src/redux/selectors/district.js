import { createSelector } from 'reselect';
import { arraysEqual } from '../../utils';
import { filterByCitySettings } from '../../utils/filters';
import { getCityFilteredData } from './results';
import { selectCities, selectSelectedCities, selectSelectedOrganizationIds } from './settings';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

export const selectSelectedDistrictType = state => state.districts.selectedDistrictType;
export const selectDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
export const selectSubdistrictUnits = state => state.districts.subdistrictUnits;
export const selectSelectedSubdistricts = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;
const selectParkingUnits = state => state.districts.parkingUnits;
export const selectDistrictsFetching = state => state.districts.districtsFetching;
export const selectDistrictAddressData = state => state.districts.districtAddressData;
export const selectDistrictUnitFetch = state => state.districts.unitFetch;

export const selectParkingUnitUnits = createSelector(
  [selectParkingUnits],
  parkingUnits => parkingUnits.filter(unit => unit.object_type === 'unit'),
);

export const selectDistrictDataBySelectedType = createSelector(
  [selectSelectedDistrictType, selectDistrictData],
  (selectedDistrictType, districtData) => {
    if (!selectedDistrictType || !districtData?.length) {
      return [];
    }
    return districtData.find(obj => obj.id === selectedDistrictType)?.data || [];
  },
  {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

export const getAddressDistrict = createSelector(
  [selectDistrictDataBySelectedType, selectCities, getAddressDistrictData],
  (districtData, citySettings, addressDistricts) => {
    if (!addressDistricts) {
      return null;
    }
    return districtData
      .filter(filterByCitySettings(citySettings))
      .find(obj => addressDistricts.some(i => i.id === obj.id));
  },
);

// Get units that are tied to each area object
export const getDistrictPrimaryUnits = createSelector(
  [selectDistrictDataBySelectedType],
  (districts) => {
    const primaryUnits = [];

    // Function to handle unit and add it to the list
    const checkUnit = (unit) => {
      if (unit.location) {
        unit.object_type = 'unit';
        primaryUnits.push(unit);
      }
    };

    districts.forEach((area) => {
      // If area data has units as list, iterate through it
      if (area.units?.length) {
        area.units.forEach(unit => checkUnit(unit));
      } else if (area.unit) {
        checkUnit(area.unit);
      }
    });

    return primaryUnits;
  },
);

const getSubDistrictUnits = createSelector(
  [selectSelectedSubdistricts, selectSubdistrictUnits],
  (selectedSubDistricts, unitData) => {
    if (selectedSubDistricts?.length && unitData) {
      return unitData.filter(
        unit => selectedSubDistricts.some(district => district === unit.division_id),
      );
    }
    return [];
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

// Get selected geographical district units, used only in non-embed mode
export const getFilteredSubdistrictServices = createSelector(
  [
    getSubDistrictUnits, selectSelectedCities, selectSelectedOrganizationIds,
  ],
  (subDistrictUnits, cities, orgIds) => getCityFilteredData(subDistrictUnits, cities, orgIds),
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

// Get area view units filtered by area view unit tab checkbox selection
export const getFilteredSubDistrictUnits = createSelector(
  [getSubDistrictUnits, getSelectedDistrictServices],
  (subDistrictUnits, serviceFilters) => {
    if (serviceFilters.length) {
      return subDistrictUnits.filter(unit => (
        unit.services.some(service => serviceFilters.includes(service.id))));
    }
    return subDistrictUnits;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);
