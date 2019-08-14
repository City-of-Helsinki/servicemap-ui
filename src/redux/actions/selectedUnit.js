import { selectedUnitFetch } from '../../utils/fetch';

export const fetchHasErrored = errorMessage => ({
  type: 'SELECTED_UNIT_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = () => ({
  type: 'SELECTED_UNIT_IS_FETCHING',
});
export const fetchSuccess = unit => ({
  type: 'SELECTED_UNIT_FETCH_DATA_SUCCESS',
  unit,
});
export const setSelectedUnit = unit => ({
  type: 'SET_SELECTED_UNIT',
  unit,
});

// Change selected unit to given unit
export const changeSelectedUnit = unit => async (dispatch) => {
  const newUnit = unit;
  if (newUnit) {
    newUnit.object_type = 'unit';
    dispatch(setSelectedUnit(newUnit));
  } else {
    dispatch(setSelectedUnit(null));
  }
};

// Fetch new selected unit
export const fetchSelectedUnit = (id, callback) => async (dispatch) => {
  const onStart = () => dispatch(fetchIsLoading());
  const onSuccess = (data) => {
    const newData = data;
    newData.complete = true;
    newData.object_type = 'unit';
    dispatch(fetchSuccess(newData));
    if (typeof callback === 'function') {
      callback();
    }
  };
  const onError = e => dispatch(fetchHasErrored(e.message));

  // Fetch data
  selectedUnitFetch(null, onStart, onSuccess, onError, null, id);
};
