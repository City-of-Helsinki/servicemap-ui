import { serviceRedirectFetch } from '../../utils/fetch';
import { redirectService } from './fetchDataActions';

// Actions
const { isFetching, fetchError, fetchSuccess } = redirectService;

// Thunk fetch
const fetchRedirectService =
  (options = null, onSuccessFunc) =>
  async (dispatch) => {
    const onStart = () => dispatch(isFetching());

    const onSuccess = (results) => {
      onSuccessFunc(results);
      dispatch(fetchSuccess(results));
    };
    const onError = (e) => dispatch(fetchError(e.message));
    // fetch data
    serviceRedirectFetch(options, onStart, onSuccess, onError);
  };

export default fetchRedirectService;
