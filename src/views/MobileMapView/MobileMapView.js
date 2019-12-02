/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../redux/actions/user';
import SearchBar from '../../components/SearchBar';
import HomeView from '../HomeView';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

const MobileMapView = ({ map, setCurrentPage }) => {
  if (map && typeof window !== 'undefined') {
    // Reftesh map when changing mobile page initialize correct size
    map._onResize();
  }

  setCurrentPage('map');

  return (
    <>
      <MobileComponent>
        <SearchBar />
      </MobileComponent>
      <DesktopComponent>
        <HomeView />
      </DesktopComponent>
    </>
  );
};

const mapStateToProps = state => ({
  map: state.mapRef.leafletElement,
});


MobileMapView.propTypes = {
  map: PropTypes.objectOf(PropTypes.any),
  setCurrentPage: PropTypes.func.isRequired,
};

MobileMapView.defaultProps = {
  map: null,
};


export default connect(
  mapStateToProps,
  { setCurrentPage },
)(MobileMapView);
