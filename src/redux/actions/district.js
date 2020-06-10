export const setHighlightedDistrict = district => ({
  type: 'SET_DISTRICT_HIGHLIGHT',
  district,
});

export const setSelectedDistrict = district => ({
  type: 'SET_SELECTED_DISTRICT',
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
