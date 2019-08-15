import { searchFetch } from '../../../utils/fetch';

const fetchAddressData = async (match) => {
  const options = {
    type: 'address',
    municipality: `${match.params.municipality}`,
    q: `${match.params.street} ${match.params.number}`,
  };
  const onSuccess = (data) => {
    let address = null;
    data.results.forEach((result) => {
      if (result.street.municipality === match.params.municipality) {
        address = result;
      }
    });
    return address;
  };
  const data = await searchFetch(options, null, onSuccess);
  return data;
};
export default fetchAddressData;
