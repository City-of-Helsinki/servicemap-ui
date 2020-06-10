const initialState = {
  highlitedDistrict: null,
  selectedDistrict: null,
  districtData: [],
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

    case 'SET_SELECTED_DISTRICT':
      if (!action.district) {
        return {
          ...state,
          selectedDistrict: null,
        };
      }
      return {
        ...state,
        selectedDistrict: action.district,
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

    default:
      return state;
  }
};
