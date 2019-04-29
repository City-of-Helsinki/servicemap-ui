import queryBuilder from '../../utils/queryBuilder';

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
  if (unit) {
    unit.object_type = 'unit';
    dispatch(setSelectedUnit(unit));
  } else {
    dispatch(setSelectedUnit(null));
  }
};

// Fetch new selected unit
export const fetchSelectedUnit = id => async (dispatch) => {
  try {
    // Fetch rest of the unit's data
    dispatch(fetchIsLoading());
    const response = await queryBuilder.setType('unit', id).run();
    if (response.ok && response.status === 200) {
      const data = await response.json();
      data.complete = true;
      data.object_type = 'unit';
      dispatch(fetchSuccess(data));
    } else {
      throw new Error(response.statusText);
    }
  } catch (e) {
    dispatch(fetchHasErrored(e.message));
    console.warn('Error fetching selected unit');
  }
};
