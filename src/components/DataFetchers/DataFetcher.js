import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUnits } from '../../redux/actions/unit';
import { fitBbox } from '../../views/MapView/utils/mapActions';
import { reverseBBoxCoordinates, searchParamData } from './helpers';

const DataFetcher = ({
  currentPage,
  fetchUnits,
  location,
  map,
}) => {
  /**
   * Handle bbox fetching
   */
  const handleBBoxFetch = () => {
    if (!map) {
      return false;
    }

    const options = searchParamData(location);
    if (options.q || options.service_node || options.service) {
      return false;
    }
    if (!options.bbox || !options.bbox_srid || !options.level) {
      return false;
    }

    fetchUnits(options);
    fitBbox(map, reverseBBoxCoordinates(options.bbox));
    return true;
  };

  // Component mount action
  useEffect(() => {
    if (!map) {
      return;
    }
    switch (currentPage) {
      case 'search':
      case 'home':
        handleBBoxFetch();
        break;
      default:
    }
  }, [currentPage, map]);

  return null;
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { mapRef, user } = state;
  const map = mapRef.leafletElement;

  return {
    currentPage: user.page,
    map,
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    fetchUnits,
  },
)(DataFetcher));

// Typechecking
DataFetcher.propTypes = {
  fetchUnits: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
};

DataFetcher.defaultProps = {
  map: null,
};
