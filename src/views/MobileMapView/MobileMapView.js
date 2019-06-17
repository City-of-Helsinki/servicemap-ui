/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../redux/actions/user';
import SearchBar from '../../components/SearchBar';
import HomeView from '../HomeView';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

const MobileMapView = ({ intl, map, setCurrentPage }) => {
  if (map && typeof window !== 'undefined') {
    // Reftesh map when changing mobile page initialize correct size
    map._onResize();
  }

  setCurrentPage('map');

  return (
    <>
      <MobileComponent>
        <SearchBar
          placeholder={intl.formatMessage({ id: 'search' })}
        />
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
  intl: intlShape.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  setCurrentPage: PropTypes.func.isRequired,
};

MobileMapView.defaultProps = {
  map: null,
};


export default injectIntl(connect(
  mapStateToProps,
  { setCurrentPage },
)(MobileMapView));
