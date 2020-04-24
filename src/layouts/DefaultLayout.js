
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { Typography, Link } from '@material-ui/core';
import MapView from '../views/MapView';
import I18n from '../i18n';
import config from '../../config';
import TopBar from '../components/TopBar';
import Settings from '../components/Settings';
import ViewRouter from './components/ViewRouter';
import DesktopComponent from '../components/DesktopComponent';
import AlertBox from '../components/AlertBox';

const mobileBreakpoint = config.mobileUiBreakpoint;
const { smallScreenBreakpoint } = config;

const createContentStyles = (
  isMobile, isSmallScreen, landscape, mobileMapOnly, fullMobileMap, settingsOpen, currentPage,
) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }
  const topBarHeight = isMobile ? `${config.topBarHeightMobile}px` : `${config.topBarHeight}px`;

  const styles = {
    activeRoot: {
      flexDirection: mobileMapOnly || isMobile ? 'column' : 'row',
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: `calc(100vh - ${topBarHeight})`,
      flex: '1 1 auto',
    },
    map: {
      position: isMobile ? 'fixed' : null,
      bottom: 0,
      margin: 0,
      flex: !isMobile || mobileMapOnly ? 1 : 0,
      display: 'flex',
      visibility: isMobile && (!mobileMapOnly || settingsOpen) ? 'hidden' : '',
      height: isMobile ? `calc(100% - ${topBarHeight})` : '100%',
      width: '100%',
      zIndex: 900,
    },
    mapWrapper: {
      width: '100%',
    },
    messageText: {
      lineHeight: 'normal',
      whiteSpace: 'pre-wrap',
    },
    sidebar: {
      height: '100%',
      position: 'relative',
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      // eslint-disable-next-line no-nested-ternary
      overflow: settingsOpen ? 'hidden'
        : isMobile ? '' : 'auto',
      visibility: mobileMapOnly && !settingsOpen ? 'hidden' : null,
      flex: '0 1 auto',
    },
    sidebarContent: {
      height: '100%',
    },
  };

  if (currentPage === 'home' && !isMobile) {
    styles.sidebar.borderRight = '8px solid transparent';
  }

  return styles;
};

const DefaultLayout = (props) => {
  const {
    currentPage, i18n, intl, location, settingsToggled, toggleSettings,
  } = props;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const fullMobileMap = new URLSearchParams(location.search).get('map'); // If mobile map without bottom navigation & searchbar
  const mobileMapOnly = isMobile && (location.pathname.indexOf('/map') > -1 || fullMobileMap); // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');
  const portrait = useMediaQuery('(max-device-aspect-ratio: 1/1)');

  const styles = createContentStyles(
    isMobile, isSmallScreen, landscape, mobileMapOnly, fullMobileMap, settingsToggled, currentPage,
  );

  const setSettingsPage = (type) => {
    if (!type || type === settingsToggled) {
      toggleSettings(null);
    } else {
      toggleSettings(type);
    }
  };

  const alertText = (
    <Typography style={styles.messageText} color="inherit">
      <FormattedMessage id="alert.text" />
      <Link
        href={intl.formatMessage({ id: 'alert.link.helsinki' })}
        target="_blank"
        rel="noopener"
        underline="always"
        color="inherit"
      >
        <FormattedMessage id="settings.city.helsinki" />
      </Link>
      {', '}

      <Link
        href={intl.formatMessage({ id: 'alert.link.espoo' })}
        target="_blank"
        rel="noopener"
        underline="always"
        color="inherit"
      >
        <FormattedMessage id="settings.city.espoo" />
      </Link>
      {', '}

      <Link
        href={intl.formatMessage({ id: 'alert.link.vantaa' })}
        target="_blank"
        rel="noopener"
        underline="always"
        color="inherit"
      >
        <FormattedMessage id="settings.city.vantaa" />
      </Link>
      {', '}

      <Link
        href={intl.formatMessage({ id: 'alert.link.kauniainen' })}
        target="_blank"
        rel="noopener"
        underline="always"
        color="inherit"
      >
        <FormattedMessage id="settings.city.kauniainen" />
      </Link>
    </Typography>
  );

  return (
    <>
      <div id="topArea" aria-hidden={!!settingsToggled}>
        <h1 id="app-title" tabIndex="-1" className="sr-only app-title" component="h1">
          <FormattedMessage id="app.title" />
        </h1>
        {/* Jump link to main content for screenreaders
        Must be first interactable element on page */}
        <a href="#view-title" className="sr-only">
          <FormattedMessage id="general.skipToContent" />
        </a>
        <TopBar
          settingsOpen={settingsToggled}
          toggleSettings={type => setSettingsPage(type)}
          smallScreen={isSmallScreen}
          i18n={i18n}
        />
      </div>

      <div id="activeRoot" style={styles.activeRoot}>
        <main role={settingsToggled && 'dialog'} className="SidebarWrapper" style={styles.sidebar}>
          {settingsToggled && (
            <Settings
              key={settingsToggled}
              toggleSettings={() => setSettingsPage()}
              isMobile={!!isMobile}
            />
          )}
          <div style={styles.sidebarContent} aria-hidden={!!settingsToggled}>
            <AlertBox
              title={<FormattedMessage id="alert.title" />}
              text={alertText}
            />
            <ViewRouter />
          </div>
        </main>
        <div
          aria-label={intl.formatMessage({ id: 'map.ariaLabel' })}
          aria-hidden={!!settingsToggled}
          tabIndex="-1"
          style={styles.map}
        >
          <div aria-hidden="true" style={styles.mapWrapper}>
            <MapView isMobile={!!isMobile} />
          </div>
        </div>
      </div>

      <footer role="contentinfo" aria-hidden={!!settingsToggled} className="sr-only">
        <DesktopComponent>
          <a href="#app-title">
            <FormattedMessage id="general.backToStart" />
          </a>
        </DesktopComponent>
      </footer>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  currentPage: PropTypes.string,
  i18n: PropTypes.instanceOf(I18n),
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  settingsToggled: PropTypes.string,
  toggleSettings: PropTypes.func.isRequired,
};

DefaultLayout.defaultProps = {
  currentPage: null,
  i18n: null,
  settingsToggled: null,
};

export default injectIntl(DefaultLayout);
