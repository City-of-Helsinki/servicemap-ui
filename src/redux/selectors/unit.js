import { createSelector } from 'reselect';

import { selectAddress } from './address';
import {
  getPage,
  selectCustomPositionCoordinates,
  selectUserPositionCoordinates,
} from './user';

export const getCurrentlyUsedPosition = createSelector(
  [
    selectCustomPositionCoordinates,
    selectUserPositionCoordinates,
    selectAddress,
    getPage,
  ],
  (
    customPositionCoordinates,
    userPositionCoordinates,
    address,
    currentPage
  ) => {
    const addressPosition =
      currentPage === 'address' && address?.addressCoordinates
        ? {
            latitude: address.addressCoordinates[1],
            longitude: address.addressCoordinates[0],
          }
        : null;

    const usedPosition =
      customPositionCoordinates || addressPosition || userPositionCoordinates;
    if (usedPosition?.latitude && usedPosition?.longitude) {
      return usedPosition;
    }
    return null;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) =>
        a?.latitude === b?.latitude && a?.longitude === b?.longitude,
    },
  }
);

export const calculateDistance = (unit, usedPosition) => {
  if (!unit || !unit.location) {
    return null;
  }

  if (!usedPosition) {
    return null;
  }

  const toRadians = (degree) => {
    const pi = Math.PI;
    return degree * (pi / 180);
  };

  // Calculate distance between two coordinates using the Haversine formula
  const r = 6371e3;
  const lat1 = unit.location.coordinates[1];
  const lat2 = usedPosition.latitude;
  const lon1 = unit.location.coordinates[0];
  const lon2 = usedPosition.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = Math.round(r * c);

  return distance;
};
