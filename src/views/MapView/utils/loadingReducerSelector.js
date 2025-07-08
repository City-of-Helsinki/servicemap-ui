import { createSelector } from 'reselect';

import { selectDistrictUnitFetch } from '../../../redux/selectors/district';
import { selectSearchResults } from '../../../redux/selectors/results';
import { selectServiceDataSet } from '../../../redux/selectors/service';
import { getStatisticalDistrictUnitsState } from '../../../redux/selectors/statisticalDistrict';
import { alphabeticCompare, arraysEqual } from '../../../utils';

/*
 * Helper file for quite complex logic of Loading component data.
 */

function reducerDataToEqualsComparableArray(a) {
  const values = a.loadingReducer
    ? Object.keys(a.loadingReducer)
        .sort(alphabeticCompare)
        .map((key) => a.loadingReducer[key])
    : [null];
  return [a.showLoadingScreen, a.hideLoadingNumbers, ...values];
}

function resultEqualityCheck(a, b) {
  return arraysEqual(
    reducerDataToEqualsComparableArray(a),
    reducerDataToEqualsComparableArray(b)
  );
}

/**
 *
 * showLoadingScreen: should loading screen be shown.
 * loadingReducer: a reducer for Loading component
 * hideLoadingNumbers: should the numbers be hiddden in Loading component
 */
export const selectDistrictLoadingReducer = createSelector(
  [
    selectDistrictUnitFetch,
    getStatisticalDistrictUnitsState,
    (state) => !!state.districts.districtsFetching?.length,
  ],
  (districtUnitsFetch, statisticalDistrictFetch, districtsFetching) => {
    const districtViewFetching =
      districtUnitsFetch.isFetching || districtsFetching;
    const showLoadingScreen =
      statisticalDistrictFetch.isFetching || districtViewFetching;
    let loadingReducer = null;
    let hideLoadingNumbers = false;
    if (statisticalDistrictFetch.isFetching) {
      loadingReducer = statisticalDistrictFetch;
      hideLoadingNumbers = true;
    } else if (districtViewFetching) {
      loadingReducer = {
        ...districtUnitsFetch,
        isFetching: districtViewFetching,
      };
    }
    return { showLoadingScreen, loadingReducer, hideLoadingNumbers };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => resultEqualityCheck(a, b),
    },
  }
);

export const selectServiceUnitSearchResultLoadingReducer = createSelector(
  [selectServiceDataSet, selectSearchResults],
  (serviceUnitsDataSet, searchResultsDataSet) => {
    const showLoadingScreen =
      serviceUnitsDataSet.isFetching || searchResultsDataSet.isFetching;
    let loadingReducer = null;
    if (serviceUnitsDataSet.isFetching) {
      loadingReducer = serviceUnitsDataSet;
    } else if (searchResultsDataSet.isFetching) {
      loadingReducer = searchResultsDataSet;
    }
    return { showLoadingScreen, loadingReducer, hideLoadingNumbers: false };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => resultEqualityCheck(a, b),
    },
  }
);

export function resolveCombinedReducerData(
  districtLoadingReducerData,
  embedded,
  serviceUnitSearchResultReducerData
) {
  if (districtLoadingReducerData.showLoadingScreen) {
    return districtLoadingReducerData;
  }
  if (embedded && serviceUnitSearchResultReducerData.showLoadingScreen) {
    return serviceUnitSearchResultReducerData;
  }
  return {
    showLoadingScreen: false,
    loadingReducer: null,
    hideLoadingNumbers: false,
  };
}
