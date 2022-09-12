import { hearingMaps } from './fetchDataActions';
import HearingMapAPI from '../../utils/newFetch/HearingMapAPI';

const {
  isFetching, fetchError, fetchSuccess,
} = hearingMaps;

export const fetchHearingMaps = id => async (dispatch) => {
  const hearingMapAPI = new HearingMapAPI();
  try {
    dispatch(isFetching());
    const data = await hearingMapAPI.hearingMaps(id);
    dispatch(fetchSuccess({ id, data: data || [] }));
  } catch (e) {
    dispatch(fetchError(e.message));
  }
};

export default fetchHearingMaps;
