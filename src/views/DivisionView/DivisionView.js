import { useEffect } from 'react';
import PropTypes from 'prop-types';
import fetchDivisionDistrict from './fetchDivisionDistrict';
import { focusDistrict } from '../MapView/utils/mapActions';
import { parseSearchParams } from '../../utils';

const DivisionView = ({
  fetchUnits,
  highlightedDistrict,
  location,
  map,
  match,
  setHighlightedDistrict,
}) => {
  useEffect(() => {
    const { area, city } = match.params;

    const searchParams = parseSearchParams(location.search);
    let options = null;

    if (searchParams.ocd_id) {
      options = {
        division: searchParams.ocd_id,
        only: 'root_service_nodes,services,location,name,street_address,contract_type,municipality',
        page: 1,
        page_size: 100,
      };
    } else if (area && city) {
      options = {
        division: `${city}/${area}`,
        level: 'all',
        only: 'root_service_nodes,services,location,name,street_address,contract_type,municipality',
        page: 1,
        page_size: 100,
      };
    }

    if (options) {
      fetchUnits(options);
      fetchDivisionDistrict(options.division)
        .then((data) => {
          setHighlightedDistrict(data[0]);
        });
    }
  }, []);

  useEffect(() => {
    if (!highlightedDistrict) {
      return;
    }
    const { coordinates } = highlightedDistrict.boundary;
    if (map && coordinates) {
      focusDistrict(map, coordinates);
    }
  }, [map, highlightedDistrict]);

  return null;
};


export default DivisionView;

// Typechecking
DivisionView.propTypes = {
  fetchUnits: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  setHighlightedDistrict: PropTypes.func.isRequired,
};

DivisionView.defaultProps = {
  highlightedDistrict: null,
  map: null,
};
