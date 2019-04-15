
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Grid, Typography, AppBar, Toolbar, withStyles,
} from '@material-ui/core';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { Home, Map } from '@material-ui/icons';
import Sidebar from '../views/Sidebar';
import MapContainer from '../views/Map/MapContainer';
import I18n from '../i18n';
import MobileBottomNavigation from '../components/MobileBottomNavigation/MobileBottomNavigation';
import config from '../../config';
import { generatePath } from '../utils/path';
import HomeLogo from '../components/Logos/HomeLogo';

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
      overflow: 'auto',
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
    margin: 0,
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    height: '99.5vh',
  },
};

const DefaultLayout = (props) => {
  const {
    classes, i18n, intl, onLanguageChange, location, history, match,
  } = props;
  const { params } = match;
  const lng = params && params.lng;
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
                <a href={generatePath('home', lng)} style={{ display: 'inline-block' }} className="focus-dark-background">
                  <HomeLogo aria-hidden="true" />
                  <Typography className="sr-only" color="inherit" component="h1" variant="body1">
                    <FormattedMessage id="app.title" />
                  </Typography>
                </a>
              </Grid>
              <Grid item>
                {
                  i18n.availableLocales
                    .filter(locale => locale !== i18n.locale)
                    .map(locale => (
                      <Button className="focus-dark-background" key={locale} color="inherit" onClick={() => onLanguageChange(locale)}>{i18n.localeText(locale)}</Button>
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
        <MobileBottomNavigation
          style={styles.mobileNav}
          actions={[
            {
              label: intl.formatMessage({ id: 'general.home' }),
              onClick: () => {
                if (history) {
                  // TODO: Add query text once functionality is ready for search view
                  history.push(generatePath('home', lng));
                }
              },
              icon: <Home />,
              path: 'home',
            },
            {
              label: intl.formatMessage({ id: 'map' }),
              onClick: () => {
                if (history) {
                  // TODO: Add query text once functionality is ready for search view
                  history.push(generatePath('map'), lng);
                }
              },
              icon: <Map />,
              path: 'map',
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
              path: 'settings',
            },
            */
          ]}
        />

      </div>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  i18n: PropTypes.instanceOf(I18n),
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

DefaultLayout.defaultProps = {
  i18n: null,
};

export default injectIntl(withRouter(withStyles(styles)(DefaultLayout)));
