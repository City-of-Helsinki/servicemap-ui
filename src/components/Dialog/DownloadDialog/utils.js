import config from '../../../../config';
import ServiceMapAPI from '../../../utils/newFetch/ServiceMapAPI';

const smAPI = new ServiceMapAPI();

export const fetchServiceNames = async (ids) => {
  if (!ids) {
    return null;
  }

  return await smAPI.serviceNames(ids)
    .then((data) => {
      return data?.map(v => v.name);
    })
}

export default fetchServiceNames;
