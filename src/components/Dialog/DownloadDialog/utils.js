import config from '../../../../config';

// Fetch service names using givcen service_node id's
export const fetchServiceNames = (ids) => {
  if (!ids) {
    return null;
  }

  return fetch(`${config.serviceMapAPI.root}/service_node/?id=${ids}&page=1&page_size=1000`)
    .then(response => response.json())
    .then((data) => {
      const nameArray = data?.results?.map(v => v.name);
      return nameArray;
    }).catch((e) => {
      console.error('Error while fetching service names', e);
    });
};

export default fetchServiceNames;
