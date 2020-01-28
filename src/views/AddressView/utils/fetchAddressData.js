import { addressFetch } from '../../../utils/fetch';


const fetchAddressData = async (options) => {
  const data = {};
  if (options.municipality && options.street && options.number) {
    data.street = options.street;
    data.municipality = options.municipality;
    data.number = options.number;
  } else {
    return null;
  }
  if (options.language) {
    data.language = options.language;
  }

  const onSuccess = async (response) => {
    let address = null;
    if (response.results.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      address = response.results[0];
    } else {
      data.language = data.language === 'fi' ? 'sv' : 'fi';
      address = await addressFetch(data, null, (response) => {
        if (response.results.length === 1) {
          return response.results[0];
        }
        return null;
      });
    }
    return address;
  };
  const response = await addressFetch(data, null, onSuccess);
  return response;
};

export default fetchAddressData;
