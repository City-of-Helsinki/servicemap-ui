import distance from '@turf/distance';
import flip from '@turf/flip';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import {
  selectAddressAdminDistricts,
  selectAddressUnits,
} from '../../../redux/selectors/address';
import {
  getDistrictPrimaryUnits,
  getFilteredSubDistrictUnits,
  selectParkingUnitUnits,
} from '../../../redux/selectors/district';
import {
  getOrderedSearchResultData,
  selectResultsIsFetching,
} from '../../../redux/selectors/results';
import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import {
  getServiceUnits,
  selectServiceIsFetching,
} from '../../../redux/selectors/service';
import { getServiceFilteredStatisticalDistrictUnits } from '../../../redux/selectors/statisticalDistrict';
import { getLocale, getPage } from '../../../redux/selectors/user';
import { orderUnits } from '../../../utils/orderUnits';
import { useEmbedStatus } from '../../../utils/path';

// Helper function to handle address view units
const handleAdrressUnits = (addressToRender, adminDistricts, addressUnits) => {
  switch (addressToRender) {
    case 'adminDistricts':
      return adminDistricts
        .flatMap((d) => [d.unit, ...(d.units || [])])
        .filter((x) => !!x)
        .filter(
          (unit, index, self) =>
            index === self.findIndex((x) => x.id === unit.id)
        );
    case 'units':
      return addressUnits;
    default:
      return [];
  }
};

// Helper function to add additional service units to unit page if specified on Url parameters
const handleServiceUnitsFromUrl = (mapUnits, serviceUnits, location) => {
  const distanceParameter = new URLSearchParams(location.search).get(
    'distance'
  );
  let additionalUnits = serviceUnits;
  // Filter units within distance
  if (distanceParameter && mapUnits.length === 1) {
    const targetGeometry = mapUnits[0].geometry;
    if (targetGeometry) {
      // Function to check if unit coordinates are within the specified distance
      const isWithinDistance = (unitCoord) => {
        const checkDistance = (a, b) =>
          distance(a, b) * 1000 <= distanceParameter;
        // If target has only one point as geometry data, compare distance between points
        if (targetGeometry.type === 'Point') {
          return checkDistance(flip(targetGeometry), unitCoord);
        }
        // Else flatten multiline coordinates to a list of coordinate pairs and check each one
        return targetGeometry.coordinates
          .flat()
          .some((coord) => checkDistance(coord, unitCoord));
      };

      // Filter unitlist to include only units within the specified distance
      additionalUnits = serviceUnits.filter((unit) => {
        if (unit.id === mapUnits[0].id) return false;
        if (unit.location?.coordinates) {
          const unitCoordinates = flip(unit.location);
          return isWithinDistance(unitCoordinates);
        }
        return false;
      });
    }
  }
  return additionalUnits;
};

/*
  This hook servers as the single global source that defines which units
  should be rendered to map on each page
*/

const useMapUnits = () => {
  const embedded = useEmbedStatus();
  const location = useLocation();
  const searchResults = useSelector(getOrderedSearchResultData);
  const currentPage = useSelector(getPage);
  const addressToRender = useSelector((state) => state.address.toRender);
  const adminDistricts = useSelector(selectAddressAdminDistricts);
  const addressUnits = useSelector(selectAddressUnits);
  const serviceUnits = useSelector(getServiceUnits);
  const districtPrimaryUnits = useSelector(getDistrictPrimaryUnits);
  const districtServiceUnits = useSelector(getFilteredSubDistrictUnits);
  const statisticalDistrictUnits = useSelector(
    getServiceFilteredStatisticalDistrictUnits
  );
  const parkingAreaUnits = useSelector(selectParkingUnitUnits);
  const highlightedUnit = useSelector(getSelectedUnit);
  const locale = useSelector(getLocale);

  const searchUnitsLoading = useSelector(selectResultsIsFetching);
  const serviceUnitsLoading = useSelector(selectServiceIsFetching);
  const unitsLoading = searchUnitsLoading || serviceUnitsLoading;

  const searchParams = new URLSearchParams(location.search);
  const unitParam = searchParams.get('units');
  const servicesParams = searchParams.get('services');
  const statisticalTabOpen = searchParams.get('t') === '2';

  if (embedded && unitParam === 'none') {
    return [];
  }

  const filteredUnits = searchResults.filter(
    (item) =>
      item.object_type === 'unit' ||
      (item.object_type === 'event' && item.location)
  );

  // Figure out which units to show on map on different pages
  const getMapUnits = () => {
    switch (currentPage) {
      case 'search':
      case 'division':
        return filteredUnits;

      case 'unit':
      case 'fullList':
      case 'event':
        if (highlightedUnit) return [highlightedUnit];
        return [];

      case 'address':
        return handleAdrressUnits(
          addressToRender,
          adminDistricts,
          addressUnits
        );

      case 'service':
        if (serviceUnits && !unitsLoading) return serviceUnits;
        return [];

      case 'area': {
        const results = [
          ...districtPrimaryUnits,
          ...districtServiceUnits,
          ...parkingAreaUnits,
          ...(statisticalTabOpen ? statisticalDistrictUnits : []),
        ];

        return orderUnits(results, {
          locale,
          direction: 'desc',
          order: 'alphabetical',
        });
      }
      default:
        return [];
    }
  };

  let mapUnits = getMapUnits();

  // Add additional service units on unit page if specified in Url parameters
  if (servicesParams && currentPage === 'unit') {
    const additionalUnits = handleServiceUnitsFromUrl(
      mapUnits,
      serviceUnits,
      location
    );
    if (additionalUnits?.length) {
      mapUnits = [...mapUnits, ...additionalUnits];
    }
  }

  return mapUnits;
};

export default useMapUnits;
