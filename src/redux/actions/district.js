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

export const setSubdistrictUnits = units => ({
  type: 'SET_SUBDISTRICT_UNITS',
  units,
});

export const setSelectedSubdistrict = district => ({
  type: 'SET_SELECTED_SUBDISTRICT',
  district,
});
