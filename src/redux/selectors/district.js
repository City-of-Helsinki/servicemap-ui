import { createSelector } from 'reselect';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistrictSelection = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData],
  (selectedDistrictType, districtData) => {
    if (selectedDistrictType && districtData) {
      return districtData.find(obj => obj.id === selectedDistrictType).data;
    }
    return [];
  },
);

export const getAddressDistrict = createSelector(
  [getDistrictsByType, getAddressDistrictData],
  (districts, addressDistricts) => {
    if (districts && addressDistricts) {
      const district = districts.find(obj => addressDistricts.some(i => i.id === obj.id));
      return district ? district.id : null;
    }
    return null;
  },
);

export const getSubdistrictServices = createSelector(
  [getSubdistrictSelection, getSubdistrictUnits],
  (selectedSubdistricts, unitData) => {
    if (selectedSubdistricts && unitData) {
      return unitData.filter(unit => selectedSubdistricts.includes(unit.division_id));
    }
    return [];
  },
);

export const getFilteredSubdistrictUnits = createSelector(
  [getSubdistrictServices, getSelectedDistrictServices],
  (districtUnits, serviceFilters) => {
    if (serviceFilters.length) {
      return districtUnits.filter(unit => (
        unit.services.some(service => serviceFilters.includes(service.id))));
    }
    return districtUnits;
  },
);
