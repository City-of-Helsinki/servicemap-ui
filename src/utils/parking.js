export const parkingSpaceIDs = ['1', '2', '3', '4', '5', '6', '7'];
export const parkingSpaceVantaaTypes = [
  '12h-24h', '2h-3h', '4h-11h',
  'Ei rajoitusta', 'Lyhytaikainen', 'Maksullinen', 'Muu', 'Varattu päivisin',
];
export const parkingSpaceVantaaOtherTypes = [
  'hgv_street_parking_area', 'hgv_parking_area', 'hgv_no_parking_area', 'park_and_ride_area',
];

export function resolveParkingAreaId(area) {
  if (area.municipality === 'helsinki') {
    return area.extra.class;
  }
  if (area.municipality !== 'vantaa') {
    // Not implemented
    return null;
  }
  if (parkingSpaceVantaaOtherTypes.includes(area.type)) {
    return area.type;
  }
  return area.extra.tyyppi;
}

export function resolveParamsForParkingGeometryFetch(areaId) {
  if (parkingSpaceVantaaOtherTypes.includes(areaId)) {
    return { type: areaId };
  }
  const areaNumber = areaId.match(/\d+/g);
  return parkingSpaceIDs.includes(areaId)
    ? { extra__class: areaNumber }
    : { extra__tyyppi: areaId };
}

export function resolveParkingAreaName(area) {
  if (parkingSpaceVantaaOtherTypes.includes(area.type)) {
    return { type: 'TranslationKey', value: `area.list.${area.type}` };
  }
  if (typeof area.name === 'object') {
    return { type: 'LocalizedObject', value: area.name };
  }
  return { type: 'TranslationKey', value: `area.list.${area.name}` };
}
