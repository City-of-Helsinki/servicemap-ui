const initialState = {
  addressUnits: [],
  addressCoordinates: null,
  addressData: null,
};

export default (state = initialState, action) => {
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
        addressUnits: action.units,
      };
    default:
      return state;
  }
};
