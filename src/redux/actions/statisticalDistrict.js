import dataVisualization from '../../utils/dataVisualization';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { calculateProportion } from '../../utils/statisticalDistrict';
import swapCoordinates from '../../views/MapView/utils/swapCoordinates';
import { statisticalDistrictActions } from '../reducers/statisticalDistrict';
import { getStatisticalDistrictUnits } from '../selectors/statisticalDistrict';
import { statisticalDistrictUnits, statisticalDistrictServices } from './fetchDataActions';

const isFetching = () => ({
  type: statisticalDistrictActions.FETCH,
});

const fetchErrored = error => ({
  type: statisticalDistrictActions.FETCH_ERROR,
  error,
});

const fetchSuccess = data => ({
  type: statisticalDistrictActions.FETCH_SUCCESS,
  data,
});

const setSelection = (selection, proportionScales) => ({
  type: statisticalDistrictActions.SET_SELECTION,
  selection,
  proportionScales,
});

const setServiceSelection = service => ({
  type: statisticalDistrictActions.ADD_SERVICE_SELECTION,
  service,
});

const removeServiceSelection = service => ({
  type: statisticalDistrictActions.REMOVE_SERVICE_SELECTION,
  service,
});

const setSelectedCategory = selectedCategory => ({
  type: statisticalDistrictActions.SET_SELECTED_CATEGORY,
  selectedCategory,
});

// Normalize statistical district item
const normalizeItem = (item) => {
  const {
    boundary,
    id,
    name,
    ocd_id,
    extra,
    municipality,
  } = item;
  const categories = extra?.statistical_data;
  const extraData = {};
  // Format statistical data to include proportions
  if (categories) {
    const categoryKeys = Object.keys(categories);
    categoryKeys.forEach(key => {
      const dataKeys = Object.keys(categories[key]);
      const dataValues = {};
      const total = categories[key].ALL;
      dataKeys
        .forEach((k) => {
          const dataPoint = categories[key][k];
          if (dataVisualization.isTotal(k)) {
            dataValues[k] = {
              ...categories[key][k],
            };
          } else {
            dataValues[k] = {
              ...categories[key][k],
              proportion: calculateProportion(+total.value, +dataPoint.value),
            };
          }
        });
      extraData[key] = dataValues;
    });
  }

  const adjustedBoundary = {
    ...boundary,
    coordinates: boundary.coordinates.map(
      coords => swapCoordinates(coords),
    ),
  };

  return {
    boundary: adjustedBoundary,
    id,
    municipality,
    name,
    ocd_id,
    data: extraData,
  };
};

// Normalize statistical districts
const normalizeData = (data) => {
  return data
    .filter((item) => {
      const hasData = !!item?.extra?.statistical_data;
      return hasData && item.type === 'statistical_district';
    })
    .map(item => normalizeItem(item));
};

// Fetch statistical districts with geometry
export const fetchStatisticalDistricts = () => (
  async (dispatch) => {
    try {
      dispatch(isFetching());
      const smAPI = new ServiceMapAPI();
      const data = await smAPI.statisticalGeometry();
      dispatch(fetchSuccess(normalizeData(data)));
    } catch (e) {
      console.warn(e);
      dispatch(fetchErrored(e.message));
    }
  }
);

// Fetch services for statistical distrcts
export const fetchServices = () => (
  async (dispatch) => {
    const onProgressUpdateConcurrent = (total, max) => {
      dispatch(statisticalDistrictServices.fetchProgressUpdateConcurrent(total, max));
    };
    try {
      dispatch(statisticalDistrictServices.isFetching());
      const smAPI = new ServiceMapAPI();
      smAPI.setOnProgressUpdate(onProgressUpdateConcurrent);
      const data = await smAPI.services();
      dispatch(statisticalDistrictServices.fetchSuccess(data));
    } catch (e) {
      dispatch(statisticalDistrictServices.fetchError(e.message));
    }
  }
);

// Fetch statistical district units based on selected service
export const fetchStatisticalDistrictServiceUnits = serviceID => (
  async (dispatch, getState) => {
    if (typeof serviceID !== 'number') {
      throw new Error('Invalid serviceID provided to fetchServiceUnits');
    }

    const oldUnits = getStatisticalDistrictUnits(getState());

    const progressUpdate = (count, max) => {
      if (!count) { // Start progress bar by setting max value
        dispatch(statisticalDistrictUnits.fetchAdditiveProgressUpdate({ max }));
      } else { // Update progress
        dispatch(statisticalDistrictUnits.fetchAdditiveProgressUpdate({ count }));
      }
    };
    try {
      dispatch(statisticalDistrictUnits.isAdditiveFetching());
      const smAPI = new ServiceMapAPI();
      smAPI.setOnProgressUpdate(progressUpdate);
      const options = {
        only: 'name,location,municipality,contract_type',
        include: 'services',
      };
      const data = await smAPI.serviceUnitSearch(`${serviceID}`, options);
      data.forEach((unit) => {
        unit.object_type = 'unit';
      });
      const filteredData = data.filter(unit => !oldUnits.some(oUnit => oUnit.id === unit.id));

      dispatch(statisticalDistrictUnits.fetchAdditiveSuccess(filteredData));
    } catch (e) {
      console.warn(e);
      dispatch(statisticalDistrictUnits.fetchAdditiveError(e.message));
    }
  }
);

const getSelectedCategory = (item, forecast) => {
  const category = dataVisualization.getCategory(item?.data, forecast);
  if (typeof category === 'object') {
    return category;
  }
  return undefined;
};

// Calculate proportion scales based on current selection and data
const calculateProportionScales = (data, section, isForecast) => {
  let proportionScales = {};
  if (section) {
    if (dataVisualization.isTotal(section)) {
      const proportions = data.reduce((result, element) => {
        const selectedCategory = getSelectedCategory(element, isForecast);
        if (selectedCategory && !Number.isNaN(selectedCategory[section].value)) {
          result.push(selectedCategory[section].value);
        }
        return result;
      }, []);
      if (proportions.length > 0) {
        const max = Math.max(...proportions);
        proportionScales = {
          min: 0,
          average: max / 2,
          max,
        };
      }
    } else {
      const proportions = data.reduce((result, element) => {
        const selectedCategory = getSelectedCategory(element, isForecast);
        if (selectedCategory && !Number.isNaN(selectedCategory[section].proportion)) {
          result.push(selectedCategory[section].proportion);
        }
        return result;
      }, []);
      if (proportions.length > 0) {
        const max = Math.max(...proportions);
        proportionScales = {
          min: 0.00,
          average: parseFloat((max / 2).toFixed(2)),
          max: parseFloat(max.toFixed(2)),
        };
      }
    }
  }

  return proportionScales;
};

// Select statistical district section
export const selectStatisticalDistrict = (section, isForecast = false) => (
  async (dispatch, getState) => {
    // Calculate scales
    const { data } = getState().statisticalDistrict.districts;
    const proportionScales = calculateProportionScales(data, section, isForecast);


    dispatch(setSelection({ forecast: isForecast, section, proportionScales }));
  }
);

// Add selection to areaSelections
export const addAreaSelection = selection => (
  async (dispatch) => {
    dispatch({
      type: statisticalDistrictActions.ADD_AREA_SELECTION,
      selection,
    });
  }
);

// Remove selection from areaSelections
export const removeAreaSelection = selection => (
  async (dispatch) => {
    dispatch({
      type: statisticalDistrictActions.REMOVE_AREA_SELECTION,
      selection,
    });
  }
);

// Replace areaSelections
export const replaceAreaSelection = selectedAreas => (
  async (dispatch) => {
    dispatch({
      type: statisticalDistrictActions.REPLACE_AREA_SELECTION,
      selectedAreas,
    });
  }
);

// Add selected service
export const addSelectedService = service => (
  async (dispatch) => {
    dispatch(setServiceSelection(service));
  }
);

// Remove selected service
export const removeSelectedService = service => (
  async (dispatch) => {
    dispatch(removeServiceSelection(service));
  }
);

// Set new statistical district unit data 
export const setNewStatisticalDistrictUnitData = data => (
  async (dispatch) => {
    dispatch(statisticalDistrictUnits.setNewData(data));
  }
);

export const selectCategory = category => (
  async (dispatch) => {
    dispatch(setSelectedCategory(category));
  }
);
