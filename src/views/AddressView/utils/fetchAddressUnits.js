const fetchAddressUnits = async (lnglat) => {
  const unitData = await fetch(`https://api.hel.fi/servicemap/v2/unit/?lat=${lnglat[1]}&lon=${lnglat[0]}&distance=500&only=name,location,accessibility_viewpoints&page=1&page_size=500`)
    .then(response => response.json())
    .then(data => data);
  return unitData;
};

export default fetchAddressUnits;
