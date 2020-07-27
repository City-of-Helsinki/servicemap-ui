import { hearingMaps } from './fetchDataActions';
import { hearingMapsFetch } from '../../utils/fetch';

const {
  isFetching, fetchError, fetchSuccess,
} = hearingMaps;

export const fetchHearingMaps = id => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = data => dispatch(fetchSuccess(data));
  const onError = e => dispatch(fetchError(e.message));

  hearingMapsFetch({}, onStart, onSuccess, onError, null, id);
};

export default fetchHearingMaps;
