import { createSelector } from 'reselect';

import {
  filterByCitySettings,
  getCityAndOrgFilteredData,
} from '../../utils/filters';
import {
  selectCities,
  selectSelectedCities,
  selectSelectedOrganizationIds,
} from './settings';
import { createMemoizedArraySelector } from './util';

export const getHighlightedDistrict = (state) =>
  state.districts.highlitedDistrict;
export const getDistrictOpenItems = (state) => state.districts.openItems;

export const selectSelectedDistrictType = (state) =>
  state.districts.selectedDistrictType;
export const selectDistrictData = (state) => state.districts.districtData;
const getAddressDistrictData = (state) =>
  state.districts.districtAddressData.districts;
export const selectSubdistrictUnits = (state) =>
  state.districts.subdistrictUnits;
export const selectSelectedSubdistricts = (state) =>
  state.districts.selectedSubdistricts;
export const selectSelectedDistrictServices = (state) =>
  state.districts.selectedDistrictServices;
export const selectParkingUnitsMap = (state) => state.districts.parkingUnitsMap;
export const selectParkingAreas = (state) =>
  Object.values(state.districts.parkingAreasMap || {});
export const selectParkingAreasMap = (state) => state.districts.parkingAreasMap;
export const selectSelectedParkingAreaIds = (state) =>
  state.districts.selectedParkingAreaIds;
export const selectDistrictsFetching = (state) =>
  state.districts.districtsFetching;
export const selectDistrictAddressData = (state) =>
  state.districts.districtAddressData;
export const selectDistrictUnitFetch = (state) => state.districts.unitFetch;
export const selectDistrictMapState = (state) => state.districts.mapState;

export const selectParkingUnitUnits = createMemoizedArraySelector(
  [selectParkingUnitsMap],
  (parkingUnitsMap) =>
    Object.values(parkingUnitsMap)
      .flatMap((x) => x)
      .filter((unit) => unit.object_type === 'unit')
);

export const selectDistrictDataBySelectedType = createMemoizedArraySelector(
  [selectSelectedDistrictType, selectDistrictData],
  (selectedDistrictType, districtData) => {
    if (!selectedDistrictType || !districtData?.length) {
      return [];
    }
    return (
      districtData.find((obj) => obj.id === selectedDistrictType)?.data || []
    );
  }
);

export const getAddressDistrict = createSelector(
  [selectDistrictDataBySelectedType, selectCities, getAddressDistrictData],
  (districtData, citySettings, addressDistricts) => {
    if (!addressDistricts) {
      return null;
    }
    return districtData
      .filter(filterByCitySettings(citySettings))
      .find((obj) => addressDistricts.some((i) => i.id === obj.id));
  }
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
        area.units.forEach((unit) => checkUnit(unit));
      } else if (area.unit) {
        checkUnit(area.unit);
      }
    });

    return primaryUnits;
  }
);

const getSubDistrictUnits = createMemoizedArraySelector(
  [selectSelectedSubdistricts, selectSubdistrictUnits],
  (selectedSubDistricts, unitData) => {
    if (selectedSubDistricts?.length && unitData) {
      return unitData.filter((unit) =>
        selectedSubDistricts.some((district) => district === unit.division_id)
      );
    }
    return [];
  }
);

// Get selected geographical district units, used only in non-embed mode
export const getFilteredSubdistrictServices = createMemoizedArraySelector(
  [getSubDistrictUnits, selectSelectedCities, selectSelectedOrganizationIds],
  (subDistrictUnits, cities, orgIds) =>
    getCityAndOrgFilteredData(subDistrictUnits, cities, orgIds)
);

// Get area view units filtered by area view unit tab checkbox selection
export const getFilteredSubDistrictUnits = createMemoizedArraySelector(
  [getSubDistrictUnits, selectSelectedDistrictServices],
  (subDistrictUnits, serviceFilters) => {
    if (serviceFilters.length) {
      return subDistrictUnits.filter((unit) =>
        unit.services.some((service) => serviceFilters.includes(service.id))
      );
    }
    return subDistrictUnits;
  }
);

/**
 * Filter parking areas by selected parking area ids
 */
export const selectSelectedParkingAreas = createMemoizedArraySelector(
  [selectParkingAreasMap, selectSelectedParkingAreaIds],
  (parkingAreasMap, selectedParkingAreaIds) => {
    if (!parkingAreasMap) {
      return [];
    }
    // parkingAreasMap[id] is an array of areas, flatten and remove
    // duplicates based on id
    const areas = selectedParkingAreaIds
      .map((id) => parkingAreasMap[id])
      .filter(Boolean)
      .flat();
    const uniqueAreas = [];
    const uniqueAreaIds = new Set();
    areas.forEach((area) => {
      if (area?.id && !uniqueAreaIds.has(area.id)) {
        uniqueAreas.push(area);
        uniqueAreaIds.add(area.id);
      }
    });
    return uniqueAreas;
  }
);
