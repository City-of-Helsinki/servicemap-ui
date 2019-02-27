import fetchUnits from '../../utils/fetchGetUnits';
import CreateMap from '../../utils/createMap';

export const fetchHasErrored = bool => ({
  type: 'FETCH_HAS_ERRORED',
  hasErrored: bool,
});

export const fetchIsLoading = bool => ({
  type: 'FETCH_IS_LOADING',
  isLoading: bool,
});

export const unitsFetchDataSuccess = units => ({
  type: 'UNITS_FETCH_DATA_SUCCESS',
  units,
});

export const setFilter = (filter, value) => ({
  type: 'SET_FILTER',
  filter: { filter, value },
});

export const setMapType = (mapType) => {
  const newMap = CreateMap(mapType);
  return {
    type: 'SET_MAPTYPE',
    mapType: newMap,
  };
};

// Thunk fetch
export const unitsFetchData = () => (dispatch) => {
  fetchUnits(dispatch, [], { fetchHasErrored, fetchIsLoading, unitsFetchDataSuccess });
};
