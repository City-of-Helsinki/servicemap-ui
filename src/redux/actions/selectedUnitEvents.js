import { events } from './fetchDataActions';
import { unitEventsFetch } from '../../utils/fetch';

const {
  setNewData, isFetching, isFetchingMore, fetchSuccess, fetchMoreSuccess, fetchError,
} = events;

export const changeUnitEvents = (events, meta) => async (dispatch) => {
  dispatch(setNewData(events, meta));
};

export const fetchUnitEvents = (unitId, pageSize, more) => async (dispatch) => {
  const onStart = () => dispatch(more ? isFetchingMore() : isFetching());
  const onSuccess = data => dispatch(fetchSuccess(data.data, data.meta));
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  unitEventsFetch({ location: `tprek:${unitId}`, page_size: pageSize || 5 }, onStart, onSuccess, onError);
};


export const fetchAdditionalEvents = (unitId, pageSize, next) => async (dispatch) => {
  // fetch additional data that is added to previous data
  const onStart = () => dispatch(isFetchingMore());
  const onSuccess = data => dispatch(fetchMoreSuccess(data.data, data.meta));
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  unitEventsFetch({ location: `tprek:${unitId}`, page_size: pageSize }, onStart, onSuccess, onError, null, null, null, next);
};
