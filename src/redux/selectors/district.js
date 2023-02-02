import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import config from '../../../config';
import { getSelectedCities } from './settings';

export const getHighlightedDistrict = state => state.districts.highlitedDistrict;

const getSelectedDistrict = state => state.districts.selectedDistrictType;
const getDistrictData = state => state.districts.districtData;
const getAddressDistrictData = state => state.districts.districtAddressData.districts;
export const getSubdistrictUnits = state => state.districts.subdistrictUnits;
const getSubdistrictSelection = state => state.districts.selectedSubdistricts;
const getSelectedDistrictServices = state => state.districts.selectedDistrictServices;

export const getParkingUnits = state => state.districts.parkingUnits.filter(unit => unit.object_type === 'unit');

export const getDistrictsByType = createSelector(
  [getSelectedDistrict, getDistrictData, getSelectedCities],
  (selectedDistrictType, districtData, selectedCities) => {
    if (selectedDistrictType && districtData.length) {
      const districtType = districtData.find(obj => obj.id === selectedDistrictType);

      // Filter distircts by user city settings
      if (districtType && selectedCities.length) {
        return districtType.data.filter(district => selectedCities.includes(district.municipality));
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
  [getSubdistrictSelection, getSubdistrictUnits, getSelectedCities],
  (selectedSubdistricts, unitData, citySettings) => {
    const cityFilteredUnits = citySettings?.length
      ? unitData.filter(unit => citySettings.includes(unit.municipality))
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
