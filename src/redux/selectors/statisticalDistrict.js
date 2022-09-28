import { createSelector } from 'reselect';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import flip from '@turf/flip';
import dataVisualization from '../../utils/dataVisualization';
import { getCitySettings } from './settings';
import { getLocale } from './user';

export const getStatisticalDistrictSelection = state => (
  state.statisticalDistrict.districts.selection
);
export const getStatisticalDistrictAreaSelections = state => (
  state.statisticalDistrict.districts.selectedAreas
);
export const getStatisticalDistrictUnits = state => state.statisticalDistrict.units.data;
export const getStatisticalDistrictSelectedServices = state => (
  state.statisticalDistrict.districts.selectedServices
);
export const getStatisticalDistrictUnitsState = state => state.statisticalDistrict.units;
export const getStatisticalDistrictServices = state => state.statisticalDistrict.services.data;
const getData = state => state.statisticalDistrict.districts.data;

const getSelectedValue = (item, section, forecast) => {
  try {
    return item?.data[dataVisualization.getYearBasedCategory(forecast)][section];
  } catch (e) {
    return false;
  }
};

const calculateScaleAdjustedProportion = (proportion, scales) => {
  if (Number.isNaN(proportion) || Number.isNaN(scales.min) || Number.isNaN(scales.max)) {
    return 0;
  }
  // Adjust proportions between 0-0.8
  return 0.8 * (proportion - scales.min) / (scales.max - scales.min);
};

export const getSelectedStatisticalDistricts = createSelector(
  [getStatisticalDistrictSelection, getData, getStatisticalDistrictAreaSelections],
  (selection, data) => {
    let selectedDivisions = [];
    const { forecast, proportionScales, section } = selection;

    if (typeof section === 'string' && section.length > 0 && data.length > 0) {
      selectedDivisions = data
        .filter(item => !!getSelectedValue(item, section, forecast))
        .map((d) => {
          const { value, proportion } = getSelectedValue(d, section, forecast);
          const selectedProportion = dataVisualization.isTotal(section) ? value : proportion;
          const selectedScaleAdjustedProportion = calculateScaleAdjustedProportion(
            selectedProportion,
            proportionScales,
          );
          const number = parseInt(value);
          const selectedValue = Number.isNaN(number) ? undefined : number;
          return {
            ...d,
            selectedProportion,
            selectedScaleAdjustedProportion,
            selectedValue,
          };
        });
    }

    return selectedDivisions.sort((a, b) => {
      if (a.name?.fi > b.name?.fi) return 1;
      if (a.name?.fi < b.name?.fi) return -1;
      return 0;
    });
  },
);

// Get city filtered district data
export const getCityFilteredDistricts = createSelector(
  [getSelectedStatisticalDistricts, getCitySettings],
  (data, citySettings) => {
    const groupedData = data.reduce((acc, cur) => {
      const duplicate = acc.find(list => list[0].municipality === cur.municipality);
      if (duplicate) {
        duplicate.push(cur);
      } else {
        acc.push([cur]);
      }
      return acc;
    }, []);

    // Filter data with city settings
    const selectedCities = Object.values(citySettings).filter(city => city);
    let cityFilteredData = [];
    if (!selectedCities.length) {
      cityFilteredData = groupedData;
    } else {
      cityFilteredData = groupedData.filter(data => citySettings[data[0].municipality]);
    }

    // Reorder data order by municipality
    const citiesInOrder = Object.keys(citySettings);
    cityFilteredData.sort(
      (a, b) => citiesInOrder.indexOf(a[0].municipality) - citiesInOrder.indexOf(b[0].municipality),
    );

    return cityFilteredData;
  },
);

export const getAreaSelectionBounds = createSelector(
  [getStatisticalDistrictAreaSelections, getData],
  (selectedAreas, areas) => {
    const filteredAreas = areas.filter(a => selectedAreas[a.id]);
    let unifiedArea;
    if (filteredAreas.length) {
      unifiedArea = filteredAreas
        .filter(area => !!area?.boundary)
        .map(area => area.boundary);
    }
    return unifiedArea;
  },
);

// Get area view units filtered by area view unit tab checkbox selection
export const getServiceFilteredStatisticalDistrictUnits = createSelector(
  [getStatisticalDistrictUnits, getStatisticalDistrictSelectedServices, getAreaSelectionBounds],
  (districtUnits, selectedServices, selectedAreaBounds) => {
    const serviceFilterKeys = Object.keys(selectedServices);
    if (serviceFilterKeys?.length) {
      const units = districtUnits.filter((unit) => {
        const unitCoords = unit?.location ? flip(unit.location) : false;
        return (
          (
            selectedAreaBounds
            && unitCoords
            && selectedAreaBounds.some(a => booleanPointInPolygon(unitCoords, a))
          ) && unit?.services?.some(service => !!selectedServices[service.id])
        );
      });
      return units;
    }

    return districtUnits;
  },
);

export const getOrderedStatisticalDistrictServices = createSelector(
  [getStatisticalDistrictServices, getLocale],
  (services, locale) => {
    if (services.length) {
      if (typeof locale !== 'string') {
        return services;
      }
      return services.sort((a, b) => {
        if (a.name[locale] > b.name[locale]) return 1;
        if (a.name[locale] < b.name[locale]) return -1;
        return 0;
      });
    }

    return [];
  },
);
