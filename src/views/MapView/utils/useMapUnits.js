import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { getFilteredSubdistrictUnits } from '../../../redux/selectors/district';
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


const useMapUnits = () => {
  const embedded = useEmbedStatus();
  const location = useLocation();
  const searchResults = useSelector(state => getOrderedData(state));
  const currentPage = useSelector(state => state.user.page);
  const addressToRender = useSelector(state => state.address.toRender);
  const adminDistricts = useSelector(state => state.address.adminDistricts);
  const addressUnits = useSelector(state => state.address.units);
  const serviceUnits = useSelector(state => getServiceUnits(state));
  const districtUnits = useSelector(state => getFilteredSubdistrictUnits(state));
  const parkingAreaUnits = useSelector(state => state.districts.parkingUnits);
  const highlightedUnit = useSelector(state => getSelectedUnit(state));

  const searchUnitsLoading = useSelector(state => state.units.isFetching);
  const serviceUnitsLoading = useSelector(state => state.service.isFetching);
  const unitsLoading = searchUnitsLoading || serviceUnitsLoading;

  const unitParam = new URLSearchParams(location.search).get('units');

  if (embedded && unitParam === 'none') {
    return [];
  }

  const filteredUnits = searchResults.filter(item => item.object_type === 'unit');

  // Figure out which units to show on map on different pages
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
      if (districtUnits) return districtUnits;
      if (parkingAreaUnits.length) return parkingAreaUnits;
      return [];

    default:
      return [];
  }
};

export default useMapUnits;
