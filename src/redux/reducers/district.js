const initialState = {
  highlitedDistrict: null,
  selectedDistrictType: null,
  districtData: [],
  subdistrictUnits: [],
  selectedSubdistricts: [],
  selectedDistrictServices: [],
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
        districtData: [...state.districtData, action.data],
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

    case 'ADD_SUBDISTRICT_UNITS':
      return {
        ...state,
        subdistrictUnits: [...state.subdistrictUnits, ...action.units],
      };

    case 'SET_SELECTED_SUBDISTRICTS':
      return {
        ...state,
        selectedSubdistricts: action.districts,
      };

    case 'SET_SELECTED_DISTRICT_SERVICES':
      return {
        ...state,
        selectedDistrictServices: action.services,
      };

    default:
      return state;
  }
};
