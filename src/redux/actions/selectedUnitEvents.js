import { unitEventsFetch } from '../../utils/fetch';
import { events } from './fetchDataActions';

const {
  setNewData,
  isFetching,
  fetchSuccess,
  fetchError,
  fetchProgressUpdate,
} = events;

export const changeUnitEvents = (events, meta) => async (dispatch) => {
  dispatch(setNewData(events, meta));
};

export const fetchUnitEvents =
  (unitId, pageSize, all = false) =>
  async (dispatch, getState) => {
    const { selectedUnit } = getState();
    const { events } = selectedUnit;
    const previousFetch = events.previousSearch;
    if (previousFetch) {
      const parts = previousFetch.split('-');
      if (parts[0] === unitId && parts[1] === 'all') {
        return;
      }
    }
    const onStart = () => {
      dispatch(isFetching(`${unitId}-${all ? 'all' : 'partial'}`));
    };
    const onSuccess = (data) => {
      if (data && data.length) {
        dispatch(fetchSuccess(data));
        return;
      }
      if (data.data && data.meta) {
        dispatch(
          fetchProgressUpdate(data.data.length, data.meta.count, data.meta.next)
        );
        dispatch(fetchSuccess(data.data));
      }
    };
    const onError = (e) => dispatch(fetchError(e.message));
    const onNext = all
      ? (resultTotal, response) => {
          dispatch(
            fetchProgressUpdate(resultTotal.length, response.meta.count)
          );
        }
      : null;

    // Fetch data
    unitEventsFetch(
      { location: `tprek:${unitId}`, page_size: pageSize || 5 },
      onStart,
      onSuccess,
      onError,
      onNext
    );
  };
