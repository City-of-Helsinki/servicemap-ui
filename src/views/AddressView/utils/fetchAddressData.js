import { addressFetch } from '../../../utils/fetch';


const fetchAddressData = async (options) => {
  const data = {};
  if (!options.municipality || !options.street || !options.number) {
    return null;
  }

  data.street = options.street;
  data.municipality = options.municipality;
  data.number = options.number;
  if (options.number_end) {
    data.number_end = options.number_end;
  }
  if (options.language) {
    data.language = options.language;
  }

  // Try to get address from response
  // Handle multiple results by comparing letter 'a' 'b' etc.
  const getAddressFromResponse = (response, options = {}) => {
    if (!response && !response.results) {
      return null;
    }

    let address = null;
    const data = response.results;

    if (data.length > 0) {
      data.forEach((result) => {
        if (options.number_end || options.letter) {
          if (
            result.letter === options.letter
            || result.number_end === options.number_end
          ) {
            address = result;
          }
          return;
        }
        if ((!result.letter && !options.letter)
          || (!result.number_end && !options.number_end)
        ) {
          address = result;
        }
      });
      if (!address) {
        // eslint-disable-next-line prefer-destructuring
        address = data[0];
      }
    }

    return address;
  };

  const onSuccess = async (response) => {
    let address = null;
    if (response.results.length > 0) {
      address = getAddressFromResponse(response, options);
    } else {
      data.language = data.language === 'fi' ? 'sv' : 'fi';
      address = await addressFetch(data, null, response => getAddressFromResponse(response, options));
    }
    return address;
  };
  const response = await addressFetch(data, null, onSuccess);
  return response;
};

export default fetchAddressData;
