
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Grid, Typography, AppBar, Toolbar, withStyles,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { Home, Map } from '@material-ui/icons';
import Sidebar from '../views/Sidebar';
import MapContainer from '../views/Map/MapContainer';
import I18n from '../i18n';
import { MobileComponent } from './WrapperComponents/WrapperComponents';
import MobileBottomNavigation from '../components/MobileBottomNavigation/MobileBottomNavigation';
import config from '../../config';


// eslint-disable-next-line camelcase
const mobileBreakpoint = config.mobile_ui_breakpoint;

const createContentStyles = (isMobile, mobileMapOnly) => {
  const styles = {
    activeRoot: {
      flexDirection: mobileMapOnly || isMobile ? 'column' : 'row',
    },
    sidebar: {
      width: isMobile ? '100%' : 360,
      margin: 0,
    },
    map: {
      display: 'flex',
      margin: 0,
      flex: !isMobile || mobileMapOnly ? 1 : 0,
    },
    mobileNav: {
      flex: '0 1 auto',
    },
  };

  // Mobile map view styles
  if (mobileMapOnly) {
    styles.sidebar.position = 'fixed';
    styles.sidebar.top = 0;
    styles.sidebar.zIndex = 999999999;
  } else if (isMobile) {
    styles.sidebar.flex = '1 1 auto';
  }

  return styles;
};

const styles = {
  activeRoot: {
    flexGrow: 1,
    margin: 0,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const DefaultLayout = (props) => {
  const {
    classes, i18n, onLanguageChange, location, history,
  } = props;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const mobileMapOnly = isMobile && location.pathname.indexOf('/map') > -1; // If mobile map view
  const styles = createContentStyles(isMobile, mobileMapOnly);

  return (
    <>
      {
        !isMobile
        && (
        <AppBar position="relative" style={{ height: 64 }}>
          <Toolbar>
            <Grid
              justify="space-between"
              container
              spacing={24}
            >
              <Grid item>
                <Typography color="inherit" variant="body1">
                  <FormattedMessage id="app.title" />
                </Typography>
              </Grid>
              <Grid item>
                {
                  i18n.availableLocales
                    .filter(locale => locale !== i18n.locale)
                    .map(locale => (
                      <Button key={locale} color="inherit" onClick={() => onLanguageChange(locale)}>{i18n.localeText(locale)}</Button>
                    ))
                }
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        )
      }
      <div className={classes.activeRoot} style={styles.activeRoot}>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        <div style={styles.map}>
          <MapContainer />
        </div>
        <MobileComponent>
          <MobileBottomNavigation
            style={styles.mobileNav}
            actions={[
              {
                label: 'Home',
                onClick: () => {
                  if (history) {
                    // TODO: Add query text once functionality is ready for search view
                    history.push('/fi/');
                  }
                },
                icon: <Home />,
                path: '/',
              },
              {
                label: 'Map',
                onClick: () => {
                  if (history) {
                    // TODO: Add query text once functionality is ready for search view
                    history.push('/fi/map/');
                  }
                },
                icon: <Map />,
                path: '/map',
              },
              /*
              {
                label: 'Settings',
                onClick: () => {
                  if (history) {
                    // TODO: Add query text once functionality is ready for search view
                    // history.push('/fi/map/');
                  }
                },
                icon: <Settings />,
                path: '/settings',
              },
              */
            ]}
          />
        </MobileComponent>

      </div>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  i18n: PropTypes.instanceOf(I18n),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

DefaultLayout.defaultProps = {
  i18n: null,
};

export default withRouter(withStyles(styles)(DefaultLayout));
