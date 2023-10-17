import { createSelector } from 'reselect';
import { getFilteredData } from './results';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
export const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistrictSelection = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;
const getSettings = state => state.settings;
const getCitySettings = state => state.settings.cities;
const selectParkingUnits = state => state.districts.parkingUnits;

export const selectParkingUnitUnits = createSelector(
  [selectParkingUnits],
  parkingUnits => parkingUnits.filter(unit => unit.object_type === 'unit'),
);

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData, getCitySettings],
  (selectedDistrictType, districtData, citySettings) => {
    if (selectedDistrictType && districtData.length) {
      const districtType = districtData.find(obj => obj.id === selectedDistrictType);
      const selectedCities = Object.values(citySettings).filter(city => city);
      // Filter distircts by user city settings
      if (districtType && selectedCities.length) {
        return districtType.data.filter(district => citySettings[district.municipality]);
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
      return districts.find(obj => addressDistricts.some(i => i.id === obj.id));
    }
    return null;
  },
);

// Get units that are tied to each area object
export const getDistrictPrimaryUnits = createSelector(
  [getDistrictsByType],
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
  [getSubdistrictSelection, getSubdistrictUnits, getSettings],
  (selectedSubdistricts, unitData, settings) => {
    const cityFilteredUnits = getFilteredData(unitData, settings);
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
