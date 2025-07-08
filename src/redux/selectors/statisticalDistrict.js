import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import flip from '@turf/flip';
import { createSelector } from 'reselect';

import dataVisualization from '../../utils/dataVisualization';
import { filterByCitySettings } from '../../utils/filters';
import { getUnitCount, unitsSortAlphabetically } from '../../utils/units';
import { selectCities, selectSelectedCities } from './settings';
import { getLocale } from './user';

export const getStatisticalDistrictSelection = (state) =>
  state.statisticalDistrict.districts.selection;
export const getStatisticalDistrictAreaSelections = (state) =>
  state.statisticalDistrict.districts.selectedAreas;
export const getStatisticalDistrictUnits = (state) =>
  state.statisticalDistrict.units.data;
export const getStatisticalDistrictSelectedServices = (state) =>
  state.statisticalDistrict.districts.selectedServices;
export const getStatisticalDistrictUnitsState = (state) =>
  state.statisticalDistrict.units;
export const getStatisticalDistrictServices = (state) =>
  state.statisticalDistrict.services.data;
export const getStatisticalDistrictServiceIsFetching = (state) =>
  state.statisticalDistrict.services.isFetching;
export const getStatisticalDistrictSelectedCategory = (state) =>
  state.statisticalDistrict.districts.selectedCategory;
export const getStatisticalDistrictsIsFetching = (state) =>
  state.statisticalDistrict.districts.isFetching;
const getData = (state) => state.statisticalDistrict.districts.data;

const getSelectedValue = (item, section, forecast) => {
  try {
    const category = dataVisualization.getCategory(item?.data, forecast);
    return category?.[section];
  } catch (e) {
    return false;
  }
};

const calculateScaleAdjustedProportion = (proportion, scales) => {
  let adjustedProportion;
  if (
    Number.isNaN(proportion) ||
    Number.isNaN(scales.min) ||
    Number.isNaN(scales.max)
  ) {
    adjustedProportion = 0;
  }
  // Adjust proportions between 0-0.8
  adjustedProportion =
    (0.8 * (proportion - scales.min)) / (scales.max - scales.min);
  if (Number.isNaN(adjustedProportion)) {
    adjustedProportion = 0;
  }

  return adjustedProportion;
};

export const getSelectedStatisticalDistricts = createSelector(
  [getStatisticalDistrictSelection, getData, selectCities],
  (selection, data, citySettings) => {
    let selectedDivisions = [];
    const { forecast, proportionScales, section } = selection;

    if (typeof section === 'string' && section.length > 0 && data.length > 0) {
      selectedDivisions = data
        .filter((item) => !!getSelectedValue(item, section, forecast))
        .map((d) => {
          const { value, proportion } = getSelectedValue(d, section, forecast);
          const selectedProportion = dataVisualization.isTotal(section)
            ? value
            : proportion;
          const selectedScaleAdjustedProportion =
            calculateScaleAdjustedProportion(
              selectedProportion,
              proportionScales
            );
          const number = parseInt(value);
          const selectedValue = Number.isNaN(number) ? undefined : number;
          return {
            ...d,
            selectedProportion:
              typeof selectedProportion === 'string'
                ? parseInt(selectedProportion)
                : selectedProportion,
            selectedScaleAdjustedProportion,
            selectedValue,
          };
        });

      // Filter out district based on city settings
      selectedDivisions = selectedDivisions.filter(
        filterByCitySettings(citySettings)
      );
    }

    return selectedDivisions.sort((a, b) => {
      if (a.name?.fi > b.name?.fi) return 1;
      if (a.name?.fi < b.name?.fi) return -1;
      return 0;
    });
  }
);

// Get city filtered district data
export const getCityGroupedData = createSelector(
  [getSelectedStatisticalDistricts, selectCities],
  (data, citySettings) => {
    const groupedData = data.reduce((acc, cur) => {
      const duplicate = acc.find(
        (list) => list[0].municipality === cur.municipality
      );
      if (duplicate) {
        duplicate.push(cur);
      } else {
        acc.push([cur]);
      }
      return acc;
    }, []);

    // Reorder data order by municipality
    const citiesInOrder = Object.keys(citySettings);
    groupedData.sort(
      (a, b) =>
        citiesInOrder.indexOf(a[0].municipality) -
        citiesInOrder.indexOf(b[0].municipality)
    );

    return groupedData;
  }
);

export const getAreaSelectionBounds = createSelector(
  [getStatisticalDistrictAreaSelections, getData],
  (selectedAreas, areas) => {
    const filteredAreas = areas.filter((a) => selectedAreas[a.id]);
    let unifiedArea;
    if (filteredAreas.length) {
      unifiedArea = filteredAreas
        .filter((area) => !!area?.boundary)
        .map((area) => area.boundary);
    }
    return unifiedArea;
  }
);

// Get area view units filtered by area view unit tab checkbox selection
export const getServiceFilteredStatisticalDistrictUnits = createSelector(
  [
    getStatisticalDistrictUnits,
    getStatisticalDistrictSelectedServices,
    getAreaSelectionBounds,
    getLocale,
  ],
  (districtUnits, selectedServices, selectedAreaBounds, locale) => {
    const serviceFilterKeys = Object.keys(selectedServices);
    if (serviceFilterKeys?.length) {
      const units = districtUnits
        .filter((unit) => {
          const unitCoords = unit?.location ? flip(unit.location) : false;
          return (
            selectedAreaBounds &&
            unitCoords &&
            selectedAreaBounds.some((a) =>
              booleanPointInPolygon(unitCoords, a)
            ) &&
            unit?.services?.some((service) => !!selectedServices[service.id])
          );
        })
        .sort(unitsSortAlphabetically(locale));
      return units;
    }

    return districtUnits;
  }
);

export const getOrderedStatisticalDistrictServices = createSelector(
  [getStatisticalDistrictServices, getLocale, selectSelectedCities],
  (services, locale, selectedCities) => {
    if (services.length) {
      if (typeof locale !== 'string') {
        return services;
      }

      return services
        .filter((s) => {
          // Filter services that have any units or with city
          // selections active if selected cities has units
          const selectedCitiesHasUnits = selectedCities.some(
            (c) => getUnitCount(s, c) > 0
          );
          return (
            s.unit_count?.total > 0 &&
            (selectedCities.length === 0 || selectedCitiesHasUnits)
          );
        }) // Filter out services without units
        .sort((a, b) => {
          if (a.name[locale] > b.name[locale]) return 1;
          if (a.name[locale] < b.name[locale]) return -1;
          return 0;
        });
    }

    return [];
  }
);

export const getStatisticalDistrictCategories = createSelector(
  [getData],
  (data) => {
    const categoryLayers = {};
    const ageCategories = [];
    const forecastCategories = [];

    // Go through data and populate age and forecast categories
    data.forEach((district) => {
      // District statistical data
      const sData = district?.data;
      if (sData) {
        // All categories in district's statistical data
        const districtCategories = Object.keys(sData);
        districtCategories.forEach((category) => {
          const yearByAge = dataVisualization.getYearByAge(category);
          const yearForecast = dataVisualization.getYearForecast(category);
          if (
            yearByAge &&
            !ageCategories.some((c) => c.category === category)
          ) {
            ageCategories.push({
              category,
              layers: dataVisualization.getStatisticsLayers(),
              year: yearByAge,
              // Type is used to identify category and get translations
              type: 'byAge',
            });
          } else if (
            yearForecast &&
            !forecastCategories.some((c) => c.category === category)
          ) {
            forecastCategories.push({
              category,
              layers: dataVisualization.getForecastsLayers(),
              year: yearForecast,
              // Type is used to identify category and get translations
              type: 'forecast',
            });
          }
        });
      }
    });

    // Reduce to show only newest for each category
    const mostRecentAgeCategory = ageCategories.reduce(
      (mostRecent, category) =>
        mostRecent && mostRecent.year > category.year ? mostRecent : category,
      undefined
    );
    if (mostRecentAgeCategory) {
      categoryLayers[mostRecentAgeCategory.category] = mostRecentAgeCategory;
    }

    // Reduce to show only newest for each category
    const mostRecentForecastCategory = forecastCategories.reduce(
      (mostRecent, category) =>
        mostRecent && mostRecent.year > category.year ? mostRecent : category,
      undefined
    );
    if (mostRecentForecastCategory) {
      categoryLayers[mostRecentForecastCategory.category] =
        mostRecentForecastCategory;
    }

    return categoryLayers;
  }
);
