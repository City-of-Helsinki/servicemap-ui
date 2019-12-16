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
  const district = results ? results[0] : null;
  district.boundary.coordinates[0] = swapCoordinates(district.boundary.coordinates[0]);
  return district;
};

export default fetchDivisionDistrict;
