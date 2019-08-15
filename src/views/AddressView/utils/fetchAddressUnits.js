import { unitsFetch } from '../../../utils/fetch';

const fetchAddressUnits = async (lnglat) => {
  const options = {
    lat: `${lnglat[1]}`,
    lon: `${lnglat[0]}`,
    distance: 500,
    only: 'name,location,accessibility_viewpoints',
    page: 1,
    page_size: 500,
  };

  const unitData = await unitsFetch(options);
  return unitData;
};

export default fetchAddressUnits;
