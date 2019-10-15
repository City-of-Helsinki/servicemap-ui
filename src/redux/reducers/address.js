const initialState = {
  addressTitle: null,
  addressUnits: [],
  addressCoordinates: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_LOCATION':
      return {
        ...state,
        addressCoordinates: action.location.addressCoordinates,
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
