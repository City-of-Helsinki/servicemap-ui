import { getCoordinatesFromUrl } from '../../../../utils/mapUtility';

/**
 * Calculate which legend items should be visible based on data and page state
 * @param {Array} data - Map data items
 * @param {Object} location - Router location object
 * @param {Object} userLocation - User's current location
 * @param {string} currentPage - Current page name
 * @param {Object} districtAddressData - District address data from Redux
 * @param {Array} districtData - District data from Redux
 * @param {Array} statisticalDistricts - Statistical districts from Redux
 * @returns {Object} Object with boolean flags for each legend item type
 */
export const calculateLegendVisibility = (
  data,
  location,
  userLocation,
  currentPage,
  districtAddressData,
  districtData,
  statisticalDistricts
) => {
  const showEvent =
    data.length === 1 &&
    data.some((item) => item.type === 'event' || item.events?.length > 0);
  return {
    event: showEvent,
    unit: !showEvent && data.length > 0,
    cluster: !showEvent && data.length > 1,
    entrances: data.length === 1 && data[0].entrances?.length > 0,
    coordinate: !!getCoordinatesFromUrl(location),
    userLocation: !!userLocation,
    address:
      currentPage === 'address' ||
      (currentPage === 'area' && !!districtAddressData?.address),
    area:
      currentPage === 'area' &&
      ((districtData && districtData.length > 0) ||
        (statisticalDistricts && statisticalDistricts.length > 0)),
  };
};
