const initialState = {
  addressId: null,
  addressTitle: null,
  clickCoordinates: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_DATA':
      return {
        ...state,
        addressId: action.addressData.addressId,
        addressTitle: action.addressData.addressTitle,
        clickCoordinates: action.addressData.clickCoordinates,
      };
    default:
      return state;
  }
};
