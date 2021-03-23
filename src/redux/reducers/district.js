const initialState = {
  highlitedDistrict: null,
  selectedDistrictType: null,
  districtData: [],
  unitsFetching: [],
  districtsFetching: [],
  subdistrictUnits: [],
  selectedSubdistricts: [],
  selectedDistrictServices: [],
  openItems: [],
  mapState: null,
  districtAddressData: {
    address: null,
    districts: [],
  },
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DISTRICT_HIGHLIGHT':
      if (!action.district) {
        return {
          ...state,
          highlitedDistrict: null,
        };
      }
      return {
        ...state,
        highlitedDistrict: action.district,
      };

    case 'SET_SELECTED_DISTRICT_TYPE':
      if (!action.district) {
        return {
          ...state,
          selectedDistrictType: null,
        };
      }
      return {
        ...state,
        selectedDistrictType: action.district,
      };

    case 'SET_DISTRICT_DATA':
      return {
        ...state,
        districtData: action.data,
      };

    case 'UPDATE_DISTRICT_DATA':
      return {
        ...state,
        districtData: state.districtData.map(obj => (obj.name === action.districtType
          ? { ...obj, data: action.data }
          : obj)),
      };

    case 'SET_DISTRICT_ADDRESS_DATA':
      if (!action.data) {
        return {
          ...state,
          districtAddressData: initialState.districtAddressData,
        };
      }
      return {
        ...state,
        districtAddressData: action.data,
      };

    case 'SET_SELECTED_SUBDISTRICTS':
      return {
        ...state,
        selectedSubdistricts: action.districts,
      };

    case 'ADD_SELECTED_DISTRICT_SERVICE':
      return {
        ...state,
        selectedDistrictServices: [...state.selectedDistrictServices, action.district],
      };

    case 'REMOVE_SELECTED_DISTRICT_SERVICE':
      return {
        ...state,
        selectedDistrictServices: [
          ...state.selectedDistrictServices.filter((item) => {
            if (Array.isArray(action.data)) {
              return !action.data.includes(item);
            }
            return item !== action.data;
          }),
        ],
      };

    case 'SET_SELECTED_DISTRICT_SERVICES':
      return {
        ...state,
        selectedDistrictServices: action.services,
      };

    case 'ADD_OPEN_ITEM':
      return {
        ...state,
        openItems: [...state.openItems, action.item],
      };

    case 'REMOVE_OPEN_ITEM':
      return {
        ...state,
        openItems: [...state.openItems.filter(id => id !== action.item)],
      };

    case 'SET_MAP_STATE':
      return {
        ...state,
        mapState: action.object,
      };

    case 'START_UNIT_FETCH':
      return {
        ...state,
        unitsFetching: [...state.unitsFetching, action.node],
      };

    case 'END_UNIT_FETCH':
      return {
        ...state,
        unitsFetching: [...state.unitsFetching.filter(item => item !== action.node)],
        subdistrictUnits: [...state.subdistrictUnits, ...action.units],
      };

    case 'START_DISTRICT_FETCH':
      return {
        ...state,
        districtsFetching: [...state.districtsFetching, action.districtType],
      };

    case 'END_DISTRICT_FETCH':
      return {
        ...state,
        districtsFetching: [
          ...state.districtsFetching.filter(item => item !== action.districtType),
        ],
      };

    default:
      return state;
  }
};
