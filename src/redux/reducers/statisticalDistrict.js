
const initialState = {
    isFetching: false,
    error: null,
    data: [],
    selection: {
      forecast: false,
      section: null,
      proportionScales: {},
    },
    areaSelections: {
      
    }
};

export const statisticalDistrictActions = {
  FETCH: 'STATISTICAL_DISTRICT_IS_FETCHING',
  FETCH_ERROR: 'STATISTICAL_DISTRICT_FETCH_ERROR',
  FETCH_SUCCESS: 'STATISTICAL_DISTRICT_FETCH_SUCCESS',
  SET_SELECTION: 'STATISTICAL_DISTRICT_SET_SELECTION',
  ADD_AREA_SELECTION: 'STATISTICAL_DISTRICT_ADD_AREA_SELECTION',
  REMOVE_AREA_SELECTION: 'STATISTICAL_DISTRICT_REMOVE_AREA_SELECTION',
};


export default (state = initialState, action) => {
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
        error: action.error
      }
    case statisticalDistrictActions.FETCH_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case statisticalDistrictActions.SET_SELECTION:
      return {
        ...state,
        selection: action.selection,
      }
    case statisticalDistrictActions.ADD_AREA_SELECTION:
      return {
        ...state,
        areaSelections: {
          ...state.areaSelections,
          [action.selection]: true,
        },
      }
    case statisticalDistrictActions.REMOVE_AREA_SELECTION:
      return {
        ...state,
        areaSelections: {
          ...state.areaSelections,
          [action.selection]: false,
        },
      }
    default:
      return state;
  }
}
