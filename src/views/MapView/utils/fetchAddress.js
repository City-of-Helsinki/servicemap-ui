import { addressFetch } from '../../../utils/fetch';

const fetchAddress = async (latlng) => {
  const options = {
    lat: `${latlng.lat}`,
    lon: `${latlng.lng}`,
    page_size: 5,
  };
  const onSuccess = (data) => data.results[0];
  const addressData = await addressFetch(options, null, onSuccess);
  return addressData;
};

export default fetchAddress;
