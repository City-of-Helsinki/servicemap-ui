import config from '../../../../config';

const url = config.reservations.apiUrl;

const fetchUnitReservations = async id => fetch(`${url}resource/?unit=tprek:${id}&page_size=100`)
  .then(response => response.json())
  .then(data => data);

export default fetchUnitReservations;
