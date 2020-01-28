const setAddressLocation = location => ({
  type: 'SET_ADDRESS_LOCATION',
  location,
});

const setAddressUnits = units => ({
  type: 'SET_ADDRESS_UNITS',
  units,
});

export {
  setAddressLocation,
  setAddressUnits,
};
