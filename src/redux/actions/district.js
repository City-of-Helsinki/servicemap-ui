export const setHighlightedDistrict = district => ({
  type: 'SET_DISTRICT_HIGHLIGHT',
  district,
});

export const setSelectedDistrictType = district => ({
  type: 'SET_SELECTED_DISTRICT_TYPE',
  district,
});

export const setDistrictData = data => ({
  type: 'SET_DISTRICT_DATA',
  data,
});

export const setDistrictAddressData = data => ({
  type: 'SET_DISTRICT_ADDRESS_DATA',
  data,
});

export const addSubdistrictUnits = units => ({
  type: 'ADD_SUBDISTRICT_UNITS',
  units,
});

export const setSelectedSubdistricts = districts => ({
  type: 'SET_SELECTED_SUBDISTRICTS',
  districts,
});

export const setSelectedDistrictServices = services => ({
  type: 'SET_SELECTED_DISTRICT_SERVICES',
  services,
});
