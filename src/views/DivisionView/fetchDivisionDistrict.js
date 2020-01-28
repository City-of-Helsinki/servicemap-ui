import { districtFetch } from '../../utils/fetch';
import swapCoordinates from '../MapView/utils/swapCoordinates';

// Fetch district data for specific devision using ocdID
const fetchDivisionDistrict = async (ocdID) => {
  const options = {
    ocd_id: ocdID,
    page: 1,
    geometry: true,
  };
  const districtData = await districtFetch(options);

  const { results } = districtData;
  const districts = results || null;

  const data = districts.reduce((result, item) => {
    const newItem = item;
    newItem.boundary.coordinates[0] = swapCoordinates(newItem.boundary.coordinates[0]);
    result.push(newItem);
    return result;
  }, []);

  return data;
};

export default fetchDivisionDistrict;
