import { unitsFetch } from '../../utils/fetch';
import { serviceTreeUnits } from './fetchDataActions';

const {
  isFetching, fetchMoreSuccess, fetchError, fetchProgressUpdate,
} = serviceTreeUnits;

export const setTreeSerivces = services => ({
  type: 'SET_TREE_SERVICES',
  services,
});

export const setTreeSelected = selected => ({
  type: 'SET_TREE_SELECTED',
  selected,
});

export const setTreeOpened = opened => ({
  type: 'SET_TREE_OPENED',
  opened,
});

export const setFetchedNode = data => ({
  type: 'SET_TREE_FETCHED',
  data,
});


export const fetchServiceTreeUnits = (
  options = null,
  abortController = null,
) => async (dispatch)
=> {
  const onStart = () => dispatch(isFetching());

  const onNodeSuccess = (results) => {
    results.forEach((unit) => {
      unit.object_type = 'unit';
    });
    dispatch(fetchMoreSuccess(results));
  };

  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => dispatch(
    fetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  const data = options;
  unitsFetch(
    data,
    onStart,
    onNodeSuccess,
    onError,
    onNext,
    null,
    abortController,
  );
};
