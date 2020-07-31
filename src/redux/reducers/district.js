const initialState = {
  highlitedDistrict: null,
  selectedDistrictType: null,
  districtData: [],
  subdistrictUnits: [],
  selectedSubdistrict: null,
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

    case 'SET_SUBDISTRICT_UNITS':
      return {
        ...state,
        subdistrictUnits: [...state.subdistrictUnits, ...action.units],
      };

    case 'SET_SELECTED_SUBDISTRICT':
      return {
        ...state,
        selectedSubdistrict: action.district,
      };

    default:
      return state;
  }
};
