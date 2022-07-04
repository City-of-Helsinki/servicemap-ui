import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import distance from '@turf/distance';
import flip from '@turf/flip';
import { getDistrictPrimaryUnits, getFilteredSubdistrictUnits } from '../../../redux/selectors/district';
import { getOrderedData } from '../../../redux/selectors/results';
import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import { getServiceUnits } from '../../../redux/selectors/service';
import { useEmbedStatus } from '../../../utils/path';


const handleAdrressUnits = (addressToRender, adminDistricts, addressUnits) => {
  let mapUnits = [];
  switch (addressToRender) {
    case 'adminDistricts':
      mapUnits = adminDistricts ? adminDistricts
        .filter(d => d.unit)
        .reduce((unique, o) => {
          // Ignore districts without unit
          if (!o.unit) {
            return unique;
          }
          // Add only unique units
          if (!unique.some(obj => obj.id === o.unit.id)) {
            unique.push(o.unit);
          }
          return unique;
        }, [])
        : [];
      break;
    case 'units':
      mapUnits = addressUnits;
      break;
    default:
      mapUnits = [];
  }

  return mapUnits;
};


// Add additional service units to unit page if specified on Url parameters
const handleServiceUnitsFromUrl = (mapUnits, serviceUnits, location) => {
  const distanceParameter = new URLSearchParams(location.search).get('distance');
  let additionalUnits = serviceUnits;
  // Filter units within distance
  if (distanceParameter && mapUnits.length === 1) {
    const targetGeometry = mapUnits[0].geometry;
    if (targetGeometry) {
      // Function to check if unit coordinates are within the specified distance
      const isWithinDistance = (unitCoord) => {
        const checkDistance = (a, b) => (
          distance(a, b) * 1000 <= distanceParameter
        );
          // If target has only one point as geometry data, compare distance between points
        if (targetGeometry.type === 'Point') {
          return checkDistance(flip(targetGeometry), unitCoord);
        }
        // Else flatten multiline coordinates to a list of coordinate pairs and check each one
        return targetGeometry.coordinates.flat().some(coord => checkDistance(coord, unitCoord));
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


const useMapUnits = () => {
  const embedded = useEmbedStatus();
  const location = useLocation();
  const searchResults = useSelector(state => getOrderedData(state));
  const currentPage = useSelector(state => state.user.page);
  const addressToRender = useSelector(state => state.address.toRender);
  const adminDistricts = useSelector(state => state.address.adminDistricts);
  const addressUnits = useSelector(state => state.address.units);
  const serviceUnits = useSelector(state => getServiceUnits(state));
  const districtPrimaryUnits = useSelector(state => getDistrictPrimaryUnits(state));
  const districtServiceUnits = useSelector(state => getFilteredSubdistrictUnits(state));
  const parkingAreaUnits = useSelector(state => state.districts.parkingUnits);
  const highlightedUnit = useSelector(state => getSelectedUnit(state));

  const areaViewUnits = [...districtPrimaryUnits, ...districtServiceUnits];

  const searchUnitsLoading = useSelector(state => state.units.isFetching);
  const serviceUnitsLoading = useSelector(state => state.service.isFetching);
  const unitsLoading = searchUnitsLoading || serviceUnitsLoading;

  const unitParam = new URLSearchParams(location.search).get('units');
  const servicesParams = new URLSearchParams(location.search).get('services');

  if (embedded && unitParam === 'none') {
    return [];
  }

  const filteredUnits = searchResults.filter(item => item.object_type === 'unit');

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
        return handleAdrressUnits(addressToRender, adminDistricts, addressUnits);

      case 'service':
        if (serviceUnits && !unitsLoading) return serviceUnits;
        return [];

      case 'area':
        return [
          ...(areaViewUnits.length ? areaViewUnits : []),
          ...(parkingAreaUnits.length ? parkingAreaUnits : []),
        ];

      default:
        return [];
    }
  };

  let mapUnits = getMapUnits();

  // Add additional service units on unit page if specified in Url parameters
  if (servicesParams && currentPage === 'unit') {
    const additionalUnits = handleServiceUnitsFromUrl(mapUnits, serviceUnits, location);
    if (additionalUnits?.length) {
      mapUnits = [...mapUnits, ...additionalUnits];
    }
  }

  return mapUnits;
};

export default useMapUnits;
