import dataVisualization from "../../utils/dataVisualization";
import ServiceMapAPI from "../../utils/newFetch/ServiceMapAPI";
import { calculateProportion } from "../../utils/statisticalDistrict";
import { statisticalDistrictActions } from "../reducers/statisticalDistrict";

const isFetching = () => ({
  type: statisticalDistrictActions.FETCH,
});

const fetchErrored = error => ({
  type: statisticalDistrictActions.FETCH,
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

// Normalize statistical district item
const normalizeItem = (item) => {
  const { boundary, id, name, ocd_id, extra, } = item;
  const categories = item?.extra?.statistical_data;
  const extraData = {};
  // Format statistical data to include proportions
  if (categories) {
    const categoryKeys = Object.keys(categories);
    categoryKeys.forEach(key => {
      const dataKeys = Object.keys(categories[key]);
      const dataValues = {};
      const total = categories[key]['total'];
      dataKeys
        .forEach(k => {
          const dataPoint = categories[key][k];
          if (dataVisualization.isTotal(k)) {
            dataValues[k] = {
              ...categories[key][k],
            }
          } else {
            dataValues[k] = {
              ...categories[key][k],
              proportion: calculateProportion(+total.value, +dataPoint.value)
            }
          }
        });
      extraData[key] = dataValues
    });

  }
  
  return {
    boundary,
    id,
    name,
    ocd_id,
    data: extraData,
  };
}

// Normalize statistical districts
const normalizeData = (data) => {
  const normalizedData = [];
  if (data.length > 0) {
    data
      .filter(item => {
        const hasData = !!item?.extra?.statistical_data;
        return hasData && item.type === 'statistical_district';
      })
      .map(item => normalizedData.push(normalizeItem(item)));
  }
  return normalizedData;
}


export const fetchStatisticalDistricts = () => (
  async (dispatch) => {
    try {
      dispatch(isFetching());
      const smAPI = new ServiceMapAPI();
      const data = await smAPI.statisticalGeometry();
      dispatch(fetchSuccess(normalizeData(data)));
    } catch (e) {
      console.log(e)
      dispatch(fetchErrored(e.message))
    }
  }
);

const getSelectedCategory = (item, forecast) => {
  const category = item?.data[dataVisualization.getYearBasedCategory(forecast)]
  if (typeof category === 'object' ) {
    return category;
  }
  return undefined;
}

const calculateProportionScales = (data, section, isForecast) => {
  let proportionScales = {};
  if (dataVisualization.isTotal(section)) {
    const proportions = data.reduce((result, element) => {
      const selectedCategory = getSelectedCategory(element, isForecast);
      if (selectedCategory && !isNaN(selectedCategory[section].value)) {
        result.push(selectedCategory[section].value);
      }
      return result;
    }, [])
    if (proportions.length > 0) {
      const max = Math.max(...proportions);
      proportionScales = {
        min: 0,
        average: max / 2,
        max: max,
      };
    }
  } else {
    const proportions = data.reduce((result, element) => {
      const selectedCategory = getSelectedCategory(element, isForecast);
      if (selectedCategory) {
        result.push(selectedCategory[section].proportion);
      }
      return result;
    }, [])
    if (proportions.length > 0) {
      const max = Math.max(...proportions);
      proportionScales = {
        min: 0.00,
        average: parseFloat((max / 2).toFixed(2)),
        max: parseFloat(max.toFixed(2)),
      };
    }
  }
  return proportionScales;
}

export const selectStatisticalDistrict = (section, isForecast = false) => (
  async (dispatch, getState) => {
    // Calculate scales
    const { data } = getState().statisticalDistrict;
    const proportionScales = calculateProportionScales(data, section, isForecast);


    dispatch(setSelection({ forecast: isForecast, section, proportionScales}))
  }
)

export const addAreaSelection = (selection) => (
  async (dispatch) => {
    dispatch({
      type: statisticalDistrictActions.ADD_AREA_SELECTION,
      selection,
    });
  }
)

export const removeAreaSelection = (selection) => (
  async (dispatch) => {
    dispatch({
      type: statisticalDistrictActions.REMOVE_AREA_SELECTION,
      selection,
    });
  }
)
