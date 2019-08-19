
const dataSet = prefix => ({
  isFetching: search => ({
    type: `${prefix}_IS_FETCHING`,
    search,
  }),
  fetchError: errorMessage => ({
    type: `${prefix}_FETCH_HAS_ERRORED`,
    errorMessage,
  }),
  fetchSuccess: data => ({
    type: `${prefix}_FETCH_DATA_SUCCESS`,
    data,
  }),
  fetchProgressUpdate: (count, max) => ({
    type: `${prefix}_FETCH_PROGRESS_UPDATE`,
    count,
    max,
  }),
  setNewData: data => ({
    type: `${prefix}_SET_DATA`,
    data,
  }),
  setNewCurrent: current => ({
    type: `${prefix}_SET_NEW_CURRENT`,
    current,
  }),
});

export const units = dataSet('UNITS');
export const service = dataSet('SERVICE');
