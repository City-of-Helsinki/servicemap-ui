export const parkingHelsinkiTypes = ['1', '2', '3', '4', '5', '6', '7'];
export const parkingVantaaTypes = [
  '12h-24h/passenger_car',
  '4h-11h/passenger_car',
  '2h-3h/passenger_car',
  'Ei rajoitusta/passenger_car',
  'Lyhytaikainen/passenger_car',
  'Maksullinen/passenger_car',
  'Muu/passenger_car',
  'Varattu päivisin/passenger_car',
];
export const parkingVantaaHeavyTrafficTypes = [
  '12h-24h/heavy_traffic',
  '4h-11h/heavy_traffic',
  '2h-3h/heavy_traffic',
  'Ei rajoitusta/heavy_traffic',
  'Lyhytaikainen/heavy_traffic',
  'Maksullinen/heavy_traffic',
  'Muu/heavy_traffic',
  'Varattu päivisin/heavy_traffic',
];
// These two types do not overlap between heavy traffic and passenger car.
export const heavyTrafficNoParking = 'hgv_no_parking_area';
export const passengerCarParkAndRide = 'park_and_ride_area';
export const parkingVantaaOtherTypes = [
  heavyTrafficNoParking,
  passengerCarParkAndRide,
];

// Vantaa API type parameters
const parkingVNTPassengerCarTypes = [
  'parking_area',
  'street_parking_area',
  'park_and_ride_area',
];
const parkingVNTHeavyTrafficTypes = [
  'hgv_parking_area',
  'hgv_street_parking_area',
  'hgv_no_parking_area',
];

const VNT = 'vantaa';
const HKI = 'helsinki';
const parkingVNTHeavyTrafficTypesParam = parkingVNTHeavyTrafficTypes.join(',');
const parkingVNTPassengerCarTypesParam = parkingVNTPassengerCarTypes.join(',');

/**
 * This "area id" is a local (in frontend) invention used to identificate different areas. In other
 * words this is an id for the checkboxes on ui. With this id we can link the checkbox open/closed
 * status in Redux, query params of GET request.
 * @param area
 * @returns {string}
 */
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
  const suffix = parkingVNTPassengerCarTypes.includes(area.type)
    ? 'passenger_car'
    : 'heavy_traffic';
  return `${area.extra.tyyppi}/${suffix}`;
}

export function resolveParamsForParkingFetch(areaId) {
  if (parkingVantaaOtherTypes.includes(areaId)) {
    return { type: areaId, municipality: VNT };
  }
  if (parkingHelsinkiTypes.includes(areaId)) {
    return { type: 'parking_area', extra__class: areaId, municipality: HKI };
  }
  if (!areaId?.includes('/')) {
    return null;
  }
  const [tyyppi, combinedType] = areaId.split('/');
  return {
    type:
      combinedType === 'heavy_traffic'
        ? parkingVNTHeavyTrafficTypesParam
        : parkingVNTPassengerCarTypesParam,
    extra__tyyppi: tyyppi,
    municipality: VNT,
  };
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
