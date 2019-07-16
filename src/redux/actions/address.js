const setAddressLocation = location => ({
  type: 'SET_ADDRESS_LOCATION',
  location,
});

const setAddressTitle = title => ({
  type: 'SET_ADDRESS_TITLE',
  title,
});

const setAddressUnits = units => ({
  type: 'SET_ADDRESS_UNITS',
  units,
});

export {
  setAddressLocation,
  setAddressTitle,
  setAddressUnits,
};
