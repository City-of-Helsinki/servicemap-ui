
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MapView from '../views/MapView';
import config from '../../config';
import TopBar from '../components/TopBar';
import Settings from '../components/Settings';
import ViewRouter from './components/ViewRouter';
import DesktopComponent from '../components/DesktopComponent';
import useMobileStatus from '../utils/isMobile';
import FocusableSRLinks from '../components/FocusableSRLinks';
import AlertBox from '../components/AlertBox';
import PrintView from '../views/PrintView';
import { PrintProvider } from '../context/PrintContext';
import { viewTitleID } from '../utils/accessibility';

const { smallScreenBreakpoint } = config;

const createContentStyles = (
  isMobile, isSmallScreen, landscape, fullMobileMap, settingsOpen, currentPage, sidebarHidden,
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
      flex: !isMobile || fullMobileMap ? 1 : 0,
      display: 'flex',
      visibility: isMobile && (!fullMobileMap || settingsOpen) ? 'hidden' : '',
      height: isMobile ? `calc(100% - ${topBarHeight})` : '100%',
      width: '100%',
      zIndex: 900,
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
        : isMobile ? 'visible' : 'auto',
      visibility: fullMobileMap && !settingsOpen ? 'hidden' : null,
      flex: '0 1 auto',
    },
    sidebarContent: {
      height: '100%',
    },
  };

  if (currentPage === 'home' && !isMobile) {
    styles.sidebar.borderRight = '8px solid transparent';
  }

  if (sidebarHidden && !isMobile) {
    styles.sidebar.display = 'none';
  }

  return styles;
};

// Shitty hack to get alert showing when not using print view
// (showAlert did not use updated showPrintView value)
const valueStore = {};

const DefaultLayout = (props) => {
  const [showPrintView, togglePrintView] = useState(false);
  const [sidebarHidden, toggleSidebarHidden] = useState(false);

  const {
    currentPage,
    fetchErrors,
    fetchNews,
    intl,
    location,
    settingsToggled,
  } = props;
  const isMobile = useMobileStatus();
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const fullMobileMap = new URLSearchParams(location.search).get('showMap'); // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');
  const portrait = useMediaQuery('(max-device-aspect-ratio: 1/1)');

  useEffect(() => {
    fetchErrors();
    fetchNews();
  }, []);

  const styles = createContentStyles(
    isMobile, isSmallScreen, landscape, fullMobileMap, settingsToggled, currentPage, sidebarHidden,
  );
  const srLinks = [
    {
      href: `#${viewTitleID}`,
      text: <FormattedMessage id="general.skipToContent" />,
    },
  ];

  const toggleSidebar = () => {
    toggleSidebarHidden(!sidebarHidden);
  };
  const togglePrint = () => {
    valueStore.showPrintView = !showPrintView;
    togglePrintView(!showPrintView);
  };
  const showAlert = () => {
    if (valueStore.showPrintView) {
      return;
    }
    alert(intl.formatMessage({ id: 'print.alert' }));
  };

  useEffect(() => {
    window.onbeforeprint = showAlert;
  }, []);


  const printClass = `ǹo-print${showPrintView ? ' sr-only' : ''}`;

  return (
    <>
      <div id="topArea" aria-hidden={!!settingsToggled} className={printClass}>
        <h1 id="app-title" tabIndex="-1" className="sr-only app-title" component="h1">
          <FormattedMessage id="app.title" />
        </h1>
        {/* Jump link to main content for screenreaders
        Must be first interactable element on page */}
        <FocusableSRLinks items={srLinks} />
        <PrintProvider value={togglePrint}>
          <TopBar
            settingsOpen={settingsToggled}
            smallScreen={isSmallScreen}
          />
        </PrintProvider>
      </div>
      {
        showPrintView
        && (
          <PrintView togglePrintView={togglePrint} />
        )
      }
      <div id="activeRoot" style={styles.activeRoot} className={printClass}>
        <main className="SidebarWrapper" style={styles.sidebar}>
          <AlertBox />
          {settingsToggled && (
            <Settings
              key={settingsToggled}
              isMobile={!!isMobile}
            />
          )}
          <div style={styles.sidebarContent} aria-hidden={!!settingsToggled}>
            <ViewRouter />
          </div>
        </main>
        <div
          aria-label={intl.formatMessage({ id: 'map.ariaLabel' })}
          aria-hidden={!!settingsToggled}
          tabIndex="-1"
          style={styles.map}
        >
          <MapView
            sidebarHidden={sidebarHidden}
            toggleSidebar={toggleSidebar}
            isMobile={!!isMobile}
          />
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
  fetchErrors: PropTypes.func.isRequired,
  fetchNews: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  settingsToggled: PropTypes.string,
};

DefaultLayout.defaultProps = {
  currentPage: null,
  settingsToggled: null,
};

export default DefaultLayout;
