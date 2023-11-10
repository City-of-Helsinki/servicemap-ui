import { createSelector } from 'reselect';
import { arraysEqual } from '../../utils';
import { filterByCitySettings } from '../../utils/filters';
import { getFilteredData } from './results';
import {
  selectCities,
  selectSelectedCities, selectSelectedOrganizationIds,
} from './settings';

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

export const getDistrictsByType = createSelector(
  [selectDistrictDataBySelectedType, selectCities],
  (districtData, citySettings) => districtData.filter(filterByCitySettings(citySettings)),
  {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

export const getAddressDistrict = createSelector(
  [getDistrictsByType, getAddressDistrictData],
  (districts, addressDistricts) => {
    if (districts && addressDistricts) {
      return districts.find(obj => addressDistricts.some(i => i.id === obj.id));
    }
    return null;
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

// Get selected geographical district units
export const getFilteredSubdistrictServices = createSelector(
  [
    selectSelectedSubdistricts, selectSubdistrictUnits,
    selectSelectedCities, selectSelectedOrganizationIds,
  ],
  (selectedSubdistricts, unitData, selectedCities, selectedOrganizationIds) => {
    const cityFilteredUnits = getFilteredData(unitData, selectedCities, selectedOrganizationIds);
    if (selectedSubdistricts?.length && unitData) {
      return cityFilteredUnits.filter(
        unit => selectedSubdistricts.some(district => district === unit.division_id),
      );
    }
    return [];
  },
);

// Get area view units filtered by area view unit tab checkbox selection
export const getFilteredSubdistrictUnits = createSelector(
  [getFilteredSubdistrictServices, getSelectedDistrictServices],
  (districtUnits, serviceFilters) => {
    if (serviceFilters.length) {
      return districtUnits.filter(unit => (
        unit.services.some(service => serviceFilters.includes(service.id))));
    }
    return districtUnits;
  },
);
