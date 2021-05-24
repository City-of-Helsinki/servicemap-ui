
import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route,
} from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Typography } from '@material-ui/core';
import MapView from '../views/MapView';
import PageHandler from './components/PageHandler';
import AddressView from '../views/AddressView';
import EventDetailView from '../views/EventDetailView';
import SearchView from '../views/SearchView';
import UnitView from '../views/UnitView';
import ServiceView from '../views/ServiceView';
import DivisionView from '../views/DivisionView';
import AreaView from '../views/AreaView';

const createContentStyles = (
  isSmallScreen, landscape, mobileMapOnly, fullMobileMap, settingsOpen,
) => {
  const width = 450;
  const styles = {
    activeRoot: {
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: '100vh',
    },
    map: {
      bottom: 0,
      margin: 0,
      flex: 1,
      display: 'flex',
      width: '100%',
    },
    sidebar: {
      height: '100%',
      position: 'relative',
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      overflow: 'auto',
      visibility: mobileMapOnly && !settingsOpen ? 'hidden' : null,
    },
    topNav: {
      minWidth: width,
    },
  };

  return styles;
};

const EmbedLayout = ({ intl }) => {
  const styles = createContentStyles();

  return (
    <>
      <div style={styles.activeRoot}>
        <div aria-hidden className="sr-only">
          <Switch>
            <Route
              path="*/embed/unit/:unit"
              render={() => (
                <>
                  <PageHandler embed page="unit" />
                  <UnitView embed />
                </>
              )}
            />
            <Route
              path="*/embed/event/:event"
              render={() => (
                <>
                  <PageHandler embed page="event" />
                  <EventDetailView embed />
                </>
              )}
            />
            <Route
              path="*/embed/search"
              render={() => (
                <>
                  <PageHandler embed page="search" />
                  <SearchView embed />
                </>
              )}
            />
            <Route
              path="*/embed/service/:service"
              render={() => (
                <>
                  <PageHandler embed page="service" />
                  <ServiceView embed />
                </>
              )}
            />
            <Route
              path="*/embed/address/:municipality/:street/:number/"
              render={() => (
                <>
                  <PageHandler embed page="address" />
                  <AddressView embed />
                </>
              )}
            />
            <Route
              path="*/embed/division/:city?/:area?"
              render={() => (
                <>
                  <PageHandler embed page="division" />
                  <DivisionView />
                </>
              )}
            />
            <Route
              path="*/embed/area/"
              render={() => (
                <>
                  <PageHandler embed page="area" />
                  <AreaView embed />
                </>
              )}
            />
          </Switch>
        </div>
        <Typography variant="srOnly">{intl.formatMessage({ id: 'map.ariaLabel' })}</Typography>
        <div aria-hidden tabIndex="-1" style={styles.map}>
          <MapView />
        </div>
      </div>
    </>
  );
};

EmbedLayout.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(EmbedLayout);
