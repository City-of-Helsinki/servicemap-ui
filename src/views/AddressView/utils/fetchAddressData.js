import ServiceMapAPI from '../../../utils/newFetch/ServiceMapAPI';

const fetchAddressData = (municipality, streetName) => {
  const smAPI = new ServiceMapAPI();
  const fetchOptions = {
    page_size: 1,
    page: 1,
    address_limit: 1,
    type: 'address',
    municipality,
  };

  // Use search endpoint to get address Data
  return smAPI.search(streetName, fetchOptions);
};

export default fetchAddressData;
