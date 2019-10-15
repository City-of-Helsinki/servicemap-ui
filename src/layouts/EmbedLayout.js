
import React from 'react';
import {
  Switch, Route,
} from 'react-router-dom';
import MapView from '../views/MapView';
import PageHandler from '../views/components/PageHandler';
import UnitFetcher from '../components/DataFetchers/UnitFetcher';
import AddressView from '../views/AddressView';

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

const EmbedLayout = () => {
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
                  <PageHandler page="unit" />
                  <UnitFetcher />
                </>
              )}
            />
            <Route
              path="*/embed/address/:municipality/:street/:number/"
              render={() => (
                <>
                  <PageHandler page="address" />
                  <AddressView embed />
                </>
              )}
            />
          </Switch>
        </div>
        <div aria-hidden style={styles.map}>
          <MapView />
        </div>
      </div>
    </>
  );
};

export default EmbedLayout;
