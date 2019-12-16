import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import fetchDivisionDistrict from './fetchDivisionDistrict';
import { focusDistrict } from '../MapView/utils/mapActions';

const DivisionView = ({
  fetchUnits,
  highlightedDistrict,
  map,
  match,
  setHighlightedDistrict,
}) => {
  useEffect(() => {
    const { area, city } = match.params;

    if (area && city) {
      const options = {
        division: `${city}/${area}`,
        level: 'all',
        only: 'root_service_nodes,services,location,name,street_address,contract_type,municipality',
        page: 1,
        page_size: 100,
      };

      fetchUnits(null, 'params', null, options);
      fetchDivisionDistrict(`${city}/${area}`)
        .then((response) => {
          setHighlightedDistrict(response);
        });
    }
  }, []);

  useEffect(() => {
    const { boundary } = highlightedDistrict || {};
    const { coordinates } = boundary || {};
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
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  setHighlightedDistrict: PropTypes.func.isRequired,
};

DivisionView.defaultProps = {
  highlightedDistrict: null,
  map: null,
};
