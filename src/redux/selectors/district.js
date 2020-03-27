import { createSelector } from 'reselect';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrict;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData],
  (selectedDistrict, districtData) => {
    if (selectedDistrict && districtData) {
      return districtData.find(obj => obj.id === selectedDistrict).data;
    }
    return null;
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
