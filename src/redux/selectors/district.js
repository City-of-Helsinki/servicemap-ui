import { createSelector } from 'reselect';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
export const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistrictSelection = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;
const getCitySettings = state => state.settings.cities;

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData, getCitySettings],
  (selectedDistrictType, districtData, citySettings) => {
    if (selectedDistrictType && districtData.length) {
      const districtType = districtData.find(obj => obj.id === selectedDistrictType);
      const selectedCities = Object.values(citySettings).filter(city => city);
      // Filter distircts by user city settings
      if (districtType && selectedCities.length) {
        const cityFilteredDistricts = districtType.data.filter(
          district => citySettings[district.municipality],
        );
        return cityFilteredDistricts;
      }
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
      return district;
    }
    return null;
  },
);

// Get selected geographical district units
export const getFilteredSubdistrictServices = createSelector(
  [getSubdistrictSelection, getSubdistrictUnits, getCitySettings],
  (selectedSubdistricts, unitData, citySettings) => {
    const selectedCities = Object.values(citySettings).filter(city => city);
    const cityFilteredUnits = selectedCities?.length
      ? unitData.filter(unit => citySettings[unit.municipality])
      : unitData;
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
