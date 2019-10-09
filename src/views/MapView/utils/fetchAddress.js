import { addressFetch } from '../../../utils/fetch';

const fetchAddress = async (latlng) => {
  const options = {
    lat: `${latlng.lat}`,
    lon: `${latlng.lng}`,
    page_size: 5,
  };
  const onSuccess = (data) => {
    const address = data.results[0];
    if (address.letter) {
      address.number += address.letter;
    }
    return data;
  };
  const addressData = await addressFetch(options, null, onSuccess);
  return addressData.results[0];
};

export default fetchAddress;
