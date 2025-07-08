import { createSelector } from 'reselect';

import { arraysEqual } from '../../utils';

export const selectAddress = (state) => state.address;
export const selectAddressUnits = createSelector(
  [(state) => state.address.units],
  (units) => units,
  { memoizeOptions: { resultEqualityCheck: (a, b) => arraysEqual(a, b) } }
);
export const selectAddressAdminDistricts = createSelector(
  [(state) => state.address.adminDistricts],
  (districts) => districts,
  { memoizeOptions: { resultEqualityCheck: (a, b) => arraysEqual(a, b) } }
);
export const selectAddressData = (state) => state.address.addressData;
