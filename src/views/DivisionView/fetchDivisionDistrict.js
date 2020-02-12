import { districtFetch } from '../../utils/fetch';

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
    result.push(item);
    return result;
  }, []);

  return data;
};

export default fetchDivisionDistrict;
