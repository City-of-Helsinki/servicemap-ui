import { selectedUnitFetch } from '../../utils/fetch';
import { selectedUnit } from './fetchDataActions';

const { isFetching, setNewData, fetchError, fetchSuccess } = selectedUnit;

// Change selected unit to given unit
export const changeSelectedUnit = (unit) => async (dispatch) => {
  const newUnit = unit;
  if (newUnit) {
    newUnit.object_type = 'unit';
    dispatch(setNewData(newUnit));
  } else {
    dispatch(setNewData(null));
  }
};

// Fetch new selected unit
export const fetchSelectedUnit = (id, callback) => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    const newData = data;
    newData.complete = true;
    newData.object_type = 'unit';
    dispatch(fetchSuccess(newData));
    if (typeof callback === 'function') {
      callback(data);
    }
  };
  const onError = (e) => dispatch(fetchError(e.message));

  // Fetch data
  selectedUnitFetch(null, onStart, onSuccess, onError, null, id);
};
