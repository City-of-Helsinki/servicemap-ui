const initialState = {
  addressId: null,
  addressTitle: null,
  addressUnits: [],
  clickCoordinates: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_LOCATION':
      return {
        ...state,
        addressId: action.location.addressId,
        clickCoordinates: action.location.clickCoordinates,
      };
    case 'SET_ADDRESS_TITLE':
      return {
        ...state,
        addressTitle: action.title,
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
