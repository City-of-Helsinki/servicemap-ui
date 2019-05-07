
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Grid, Typography, AppBar, Toolbar,
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
const smallScreenBreakpoint = config.small_screen_breakpoint;

const createContentStyles = (isMobile, isSmallScreen, mobileMapOnly) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }

  const styles = {
    activeRoot: {
      flexDirection: mobileMapOnly || isMobile ? 'column' : 'row',
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: isMobile ? '100vh' : 'calc(100% - 64px)',
    },
    sidebar: {
      width,
      margin: 0,
      overflow: 'auto',
      paddingBottom: isMobile ? '10%' : 0,
    },
    map: {
      margin: 0,
      flex: !isMobile || mobileMapOnly ? 1 : 0,
      display: isMobile && !mobileMapOnly ? 'none' : 'flex',
      height: mobileMapOnly ? '90vh' : '100%',
    },
    mobileNav: {
      flex: '0 1 auto',
      position: 'fixed',
      bottom: 0,
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

const DefaultLayout = (props) => {
  const {
    i18n, intl, location, history, match,
  } = props;
  const { params } = match;
  const lng = params && params.lng;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const mobileMapOnly = isMobile && location.pathname.indexOf('/map') > -1; // If mobile map view
  const styles = createContentStyles(isMobile, isSmallScreen, mobileMapOnly);

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
              <Grid item xs>
                {
                  // Home logo link to home view
                }
                <a id="site-title" href={generatePath('home', lng)} style={{ float: 'left', display: 'inline-block' }} className="focus-dark-background">
                  <HomeLogo aria-hidden="true" />
                  <Typography className="sr-only" color="inherit" component="h1" variant="body1">
                    <FormattedMessage id="app.title" />
                  </Typography>
                </a>
                {
                  // Jump link to main content for screenreaders
                }
                <a href="#view-title" className="sr-only">
                  <Typography variant="srOnly">
                    <FormattedMessage id="general.skipToContent" />
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={6}>
                <a href="https://forms.gle/roe9XNrZGQWBhMBJ7" rel="noopener noreferrer" target="_blank">
                  <p style={{ margin: 0, color: 'white', textDecorationColor: 'white' }}>
                    <FormattedMessage id="general.give.feedback" />
                  </p>
                </a>
              </Grid>
              <Grid item xs>
                {
                  i18n.availableLocales
                    .filter(locale => locale !== i18n.locale)
                    .map(locale => (
                      <Button
                        style={{ float: 'right' }}
                        className="focus-dark-background"
                        role="link"
                        key={locale}
                        color="inherit"
                        onClick={() => {
                          const newLocation = location;
                          const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${locale}/`);
                          newLocation.pathname = newPath;
                          window.location = `${newLocation.pathname}${newLocation.search}`;
                        }}
                      >
                        {i18n.localeText(locale)}
                      </Button>
                    ))
                }
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        )
      }
      <div style={styles.activeRoot}>
        <div style={styles.sidebar}>
          <main>
            <Sidebar />
          </main>
        </div>
        <div style={styles.map}>
          <MapContainer isMobile={!!isMobile} />
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
      <footer className="sr-only">
        <a href="#site-title">
          <FormattedMessage id="general.backToStart" />
        </a>
      </footer>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  i18n: PropTypes.instanceOf(I18n),
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

DefaultLayout.defaultProps = {
  i18n: null,
};

export default injectIntl(withRouter(DefaultLayout));
