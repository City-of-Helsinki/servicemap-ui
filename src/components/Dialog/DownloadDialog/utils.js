import ServiceMapAPI from '../../../utils/newFetch/ServiceMapAPI';

const smAPI = new ServiceMapAPI();

export const fetchServiceNames = async (ids) => {
  if (!ids) {
    return null;
  }

  return smAPI.serviceNames(ids).then((data) => data?.map((v) => v.name));
};

export default fetchServiceNames;
