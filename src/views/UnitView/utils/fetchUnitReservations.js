import { reservationsFetch } from '../../../utils/fetch';

const fetchUnitReservations = async (id) => {
  const options = {
    unit: `tprek:${id}`,
    page_size: 100,
  };
  const data = await reservationsFetch(options);
  return data;
};

export default fetchUnitReservations;
