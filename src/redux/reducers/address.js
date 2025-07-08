const initialState = {
  units: [],
  addressCoordinates: null,
  addressData: null,
  adminDistricts: [],
  toRender: 'adminDistricts',
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_DATA':
      return {
        ...state,
        addressData: action.data,
      };
    case 'SET_ADDRESS_LOCATION':
      return {
        ...state,
        addressCoordinates: action.location.addressCoordinates,
      };
    case 'SET_ADDRESS_UNITS':
      return {
        ...state,
        units: action.units,
      };
    case 'SET_ADMINISTRATIVE_DISTRICTS':
      return {
        ...state,
        adminDistricts: action.data,
      };
    case 'SET_TO_RENDER':
      return {
        ...state,
        toRender: action.data,
      };
    default:
      return state;
  }
};

export default addressReducer;
