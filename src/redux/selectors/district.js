import { createSelector } from 'reselect';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistrictSelection = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;
const settings = state => state.settings;

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData],
  (selectedDistrictType, districtData) => {
    if (selectedDistrictType && districtData.length) {
      const districtType = districtData.find(obj => obj.id === selectedDistrictType);
      return districtType ? districtType.data : [];
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

// Get selected geographical district units
export const getSubdistrictServices = createSelector(
  [getSubdistrictSelection, getSubdistrictUnits, settings],
  (selectedSubdistricts, unitData, settings) => {
    const selectedCities = Object.values(settings.cities).filter(city => city);
    const cityFilteredUnits = selectedCities.length
      ? unitData.filter(unit => settings.cities[unit.municipality])
      : unitData;
    if (selectedSubdistricts.length && unitData) {
      return cityFilteredUnits.filter(
        unit => selectedSubdistricts.some(district => district === unit.division_id),
      );
    }
    return [];
  },
);

// Get area view units filtered by area view unit tab checkbox selection
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
