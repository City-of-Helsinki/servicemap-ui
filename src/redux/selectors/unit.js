import distance from '@turf/distance';

const getCustomPosition = state => state.user.customPosition.coordinates;
const getUserPosition = state => state.user.position.coordinates;
const getAddress = state => state.address;
const getCurrentPage = state => state.user.page;

export const getCurrentlyUsedPosition = (state) => {
  const customPosition = getCustomPosition(state);
  const userPosition = getUserPosition(state);
  const address = getAddress(state);
  const currentPage = getCurrentPage(state);

  const addressPosition = currentPage === 'address' && address && address.addressCoordinates ? {
    latitude: address.addressCoordinates[1],
    longitude: address.addressCoordinates[0],
  } : null;

  const usedPosition = customPosition || addressPosition || userPosition;
  if (usedPosition && usedPosition.latitude && usedPosition.longitude) {
    return usedPosition;
  }
  return null;
};

export const calculateDistance = state => (unit) => {
  if (!unit || !unit.location) {
    return null;
  }
  const usedPosition = getCurrentlyUsedPosition(state);

  if (!usedPosition) {
    return null;
  }

  const unitDistance = Math.round(
    distance(
      unit.location.coordinates,
      [usedPosition.longitude, usedPosition.latitude],
    ) * 1000,
  );


  return unitDistance;
};
