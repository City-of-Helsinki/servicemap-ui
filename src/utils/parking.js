export const parkingHelsinkiTypes = ['1', '2', '3', '4', '5', '6', '7'];
export const parkingVantaaTypes = [
  '12h-24h', '2h-3h', '4h-11h',
  'Ei rajoitusta', 'Lyhytaikainen', 'Maksullinen', 'Muu', 'Varattu päivisin',
];
export const parkingVantaaOtherTypes = [
  'hgv_street_parking_area', 'hgv_parking_area', 'hgv_no_parking_area', 'park_and_ride_area',
];

const VNT = 'vantaa';
const HKI = 'helsinki';
const PARKING_AREA = 'parking_area';

export function resolveParkingAreaId(area) {
  if (area.municipality === HKI) {
    return area.extra.class;
  }
  if (area.municipality !== VNT) {
    // Not implemented
    return null;
  }
  if (parkingVantaaOtherTypes.includes(area.type)) {
    return area.type;
  }
  return area.extra.tyyppi;
}

export function resolveParamsForParkingFetch(areaId) {
  if (parkingVantaaOtherTypes.includes(areaId)) {
    return { type: areaId, municipality: VNT };
  }
  const areaNumber = areaId.match(/\d+/g);
  return parkingHelsinkiTypes.includes(areaId)
    ? { type: PARKING_AREA, extra__class: areaNumber, municipality: HKI }
    : { type: PARKING_AREA, extra__tyyppi: areaId, municipality: VNT };
}

export function resolveParkingAreaName(area) {
  if (parkingVantaaOtherTypes.includes(area.type)) {
    return { type: 'TranslationKey', value: `area.list.${area.type}` };
  }
  if (typeof area.name === 'object') {
    return { type: 'LocalizedObject', value: area.name };
  }
  return { type: 'TranslationKey', value: `area.list.${area.name}` };
}
