import { combineReducers } from 'redux';
import { statisticalDistrictServices, statisticalDistrictUnits } from './fetchDataReducer';

const initialState = {
  isFetching: false,
  error: null,
  data: [],
  selection: {
    forecast: false,
    section: undefined,
    proportionScales: {},
  },
  selectedAreas: {},
  selectedServices: {},
};

export const statisticalDistrictActions = {
  FETCH: 'STATISTICAL_DISTRICT_IS_FETCHING',
  FETCH_ERROR: 'STATISTICAL_DISTRICT_FETCH_ERROR',
  FETCH_SUCCESS: 'STATISTICAL_DISTRICT_FETCH_SUCCESS',
  SET_SELECTION: 'STATISTICAL_DISTRICT_SET_SELECTION',
  ADD_AREA_SELECTION: 'STATISTICAL_DISTRICT_ADD_AREA_SELECTION',
  REMOVE_AREA_SELECTION: 'STATISTICAL_DISTRICT_REMOVE_AREA_SELECTION',
  REPLACE_AREA_SELECTION: 'STATISTICAL_DISTRICT_REPLACE_AREA_SELECTION',
  ADD_SERVICE_SELECTION: 'STATISTICAL_DISTRICT_ADD_SERVICE_SELECTION',
  REMOVE_SERVICE_SELECTION: 'STATISTICAL_DISTRICT_REMOVE_SERVICE_SELECTION',
};


const statisticalDistrict = (state = initialState, action) => {
  switch (action.type) {
    case statisticalDistrictActions.FETCH:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case statisticalDistrictActions.FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case statisticalDistrictActions.FETCH_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case statisticalDistrictActions.SET_SELECTION:
      return {
        ...state,
        selection: action.selection,
      };
    case statisticalDistrictActions.ADD_AREA_SELECTION:
      return {
        ...state,
        selectedAreas: {
          ...state.selectedAreas,
          [action.selection]: true,
        },
      };
    case statisticalDistrictActions.REMOVE_AREA_SELECTION:
      return {
        ...state,
        selectedAreas: {
          ...state.selectedAreas,
          [action.selection]: false,
        },
      };
    case statisticalDistrictActions.REPLACE_AREA_SELECTION:
      return {
        ...state,
        selectedAreas: action.selectedAreas,
      };
    case statisticalDistrictActions.ADD_SERVICE_SELECTION:
      return {
        ...state,
        selectedServices: {
          ...state.selectedServices,
          [action.service]: true,
        },
      };
    case statisticalDistrictActions.REMOVE_SERVICE_SELECTION:
      return {
        ...state,
        selectedServices: {
          ...state.selectedServices,
          [action.service]: false,
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  districts: statisticalDistrict,
  units: statisticalDistrictUnits,
  services: statisticalDistrictServices,
});
