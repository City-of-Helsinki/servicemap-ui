import queryBuilder from "../../utils/queryBuilder";

export const fetchHasErrored = errorMessage => ({
  type: 'UNITS_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = () => ({
  type: 'UNITS_IS_FETCHING',
});
export const unitsFetchDataSuccess = units => ({
  type: 'UNITS_FETCH_DATA_SUCCESS',
  units,
});

// Thunk fetch
export const fetchUnits = (allData = [], next = null) => {
  return async dispatch => {
    dispatch(fetchIsLoading());
    try {
      let response = null;
      if (next) {
        response = await fetch(next);
      } else {
        response = await queryBuilder.search('kallion kirjasto').run();
      }
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      const newData = [...allData, ...data.results];
      if (data.next) {
        // Fetch the next page if response has more than one page of results
        dispatch(fetchUnits(newData, data.next));
      } else {
        dispatch(unitsFetchDataSuccess(newData));
      }
    } catch (e) {
      dispatch(fetchHasErrored(e.message));
    }
  }
};


export const fetchUnit = (id) => {
  return async dispatch => {
    dispatch(fetchIsLoading());
    const response = await queryBuilder.setType('unit', id).run();
    if (response.ok && response.status === 200) {
      const data = await response.json();
      dispatch(unitsFetchDataSuccess([data]));
    } else {
      dispatch(fetchHasErrored());
    }
  }
}
