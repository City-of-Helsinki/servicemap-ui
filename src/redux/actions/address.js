const setAddressData = (data) => ({
  type: 'SET_ADDRESS_DATA',
  data,
});

const setAddressLocation = (location) => ({
  type: 'SET_ADDRESS_LOCATION',
  location,
});

const setAddressUnits = (units) => ({
  type: 'SET_ADDRESS_UNITS',
  units,
});

const setAdminDistricts = (data) => ({
  type: 'SET_ADMINISTRATIVE_DISTRICTS',
  data,
});

const setToRender = (data) => ({
  type: 'SET_TO_RENDER',
  data,
});

export {
  setAddressData,
  setAddressLocation,
  setAddressUnits,
  setAdminDistricts,
  setToRender,
};
