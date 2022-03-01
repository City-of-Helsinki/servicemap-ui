import ServiceMapAPI from '../../../utils/newFetch/ServiceMapAPI';


const fetchAddressDataFromSearch = query => async () => {
  const smAPI = new ServiceMapAPI();

  const additionalOptions = {
    page_size: 1,
    limit: 2000,
    unit_limit: 0,
    service_limit: 0,
    address_limit: 1,
  };

  return smAPI.search(query, additionalOptions);
};


export default fetchAddressDataFromSearch;
