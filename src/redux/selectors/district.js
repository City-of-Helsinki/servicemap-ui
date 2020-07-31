import { createSelector } from 'reselect';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistricSelection = state => state.districts.selectedSubdistrict;

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
  [getSubdistricSelection, getSubdistrictUnits],
  (selectedSubdistrict, unitData) => {
    if (selectedSubdistrict && unitData) {
      return unitData.filter(obj => obj.division_id === selectedSubdistrict);
    }
    return [];
  },
);
