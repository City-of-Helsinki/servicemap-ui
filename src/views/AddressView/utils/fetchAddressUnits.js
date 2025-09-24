import { unitsFetch } from '../../../utils/fetch';

const fetchAddressUnits = async (lnglat, distance) => {
  const options = {
    lat: `${lnglat[1]}`,
    lon: `${lnglat[0]}`,
    distance,
    only: 'name,location,accessibility_shortcoming_count,',
    geometry: false,
    page: 1,
    page_size: 50,
  };

  const unitData = await unitsFetch(options);
  return unitData;
};

export default fetchAddressUnits;
