/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import SearchBar from '../../components/SearchBar';
import HomeView from '../HomeView';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

const MobileMapView = ({ intl, map }) => {
  if (map && typeof window !== 'undefined') {
    // Reftesh map when changing mobile page initialize correct size
    map._onResize();
  }

  // Modify html head
  const Head = (
    <Helmet>
      <title>{intl.formatMessage({ id: 'map' })}</title>
      <meta name="theme-color" content="" />
      <meta name="apple-mobile-web-app-status-bar-style" content="" />
    </Helmet>
  );
  return (
    <>
      <MobileComponent>
        {Head}
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
};

MobileMapView.defaultProps = {
  map: null,
};


export default injectIntl(connect(
  mapStateToProps,
  null,
)(MobileMapView));
