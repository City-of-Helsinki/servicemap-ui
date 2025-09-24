import { Typography, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { Suspense, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import config from '../../config';
import {
  AlertBox,
  BottomNav,
  DesktopComponent,
  ErrorBoundary,
  ErrorComponent,
  FocusableSRLinks,
  Loading,
  TopBar,
} from '../components';
import { ErrorProvider } from '../context/ErrorContext';
import { PrintProvider } from '../context/PrintContext';
import { fetchErrors, fetchNews } from '../redux/actions/alerts';
import { getPage } from '../redux/selectors/user';
import { DefaultRoutes } from '../routes';
import { viewTitleID } from '../utils/accessibility';
import useMobileStatus from '../utils/isMobile';
import PrintView from '../views/PrintView';

// Lazy load MapView to avoid server-side loading issues with react-leaflet
const MapView = React.lazy(() => import('../views/MapView'));

const { smallScreenBreakpoint } = config;

const createContentStyles = (
  isMobile,
  isSmallScreen,
  landscape,
  fullMobileMap,
  currentPage,
  sidebarHidden
) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }
  const topBarHeight = isMobile
    ? `${config.topBarHeightMobile}px`
    : `${config.topBarHeight}px`;
  const bottomNavHeight = isMobile ? `${config.bottomNavHeight}px` : 0;

  const styles = {
    activeRoot: {
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: !isMobile ? `calc(100vh - ${topBarHeight})` : 'initial',
      flex: '1 1 auto',
    },
    map: {
      position: isMobile ? 'fixed' : null,
      bottom: 0,
      margin: 0,
      marginBottom: bottomNavHeight,
      flex: !isMobile || fullMobileMap ? 1 : 0,
      display: 'flex',
      visibility: isMobile && !fullMobileMap ? 'hidden' : 'visible',
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
      overflow: isMobile ? 'visible' : 'auto',
      visibility: fullMobileMap ? 'hidden' : null,
      flex: '0 1 auto',
    },
    sidebarContent: {
      height: '100%',
    },
    bottomAligner: {
      height: bottomNavHeight,
      padding: 4,
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

function DefaultLayout() {
  const dispatch = useDispatch();
  const currentPage = useSelector(getPage);
  const [showPrintView, togglePrintView] = useState(false);
  const [sidebarHidden, toggleSidebarHidden] = useState(false);
  const [error, setError] = useState(false);

  const intl = useIntl();
  const isMobile = useMobileStatus();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const fullMobileMap = new URLSearchParams(location.search).get('showMap'); // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');

  useEffect(() => {
    if (dispatch) {
      dispatch(fetchErrors());
      dispatch(fetchNews());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /*
    This is for customising cookie consent modal styling. That is separated with shadow-root
    and needs to be accessed in this way.
    - Add bottom value when mobile nav bar is visible so cookie modal is not under it
    - Remove that styling on normal desktop mode
    This logic can not be in the App.js level with the cookie components, because isMobile
    hook causes rendering issues with current HDS version 4.7.1
  */
  useEffect(() => {
    let observer = null;
    let injectedStyle = null;

    const injectMobileStyle = () => {
      const host = document.querySelector('.hds-cc__target');
      if (host && host.shadowRoot && !injectedStyle) {
        const shadow = host.shadowRoot;
        const style = document.createElement('style');
        style.setAttribute('data-mobile-cookie-style', 'true');
        style.textContent = `
        .hds-cc__container {
          bottom: 4.875rem !important;
        }
      `;
        shadow.appendChild(style);
        injectedStyle = style;
        if (observer) {
          observer.disconnect();
        }
      }
    };

    const removeMobileStyle = () => {
      const host = document.querySelector('.hds-cc__target');
      if (host && host.shadowRoot) {
        const existingStyle = host.shadowRoot.querySelector(
          '[data-mobile-cookie-style="true"]'
        );
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    };

    if (isMobile) {
      // Try to inject immediately if element exists
      injectMobileStyle();

      // If not found, observe for it
      if (!injectedStyle) {
        observer = new MutationObserver(injectMobileStyle);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } else {
      // Remove style when not mobile
      removeMobileStyle();
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      // Clean up injected style on unmount
      if (injectedStyle && injectedStyle.parentNode) {
        injectedStyle.remove();
      }
    };
  }, [isMobile]);

  const styles = createContentStyles(
    isMobile,
    isSmallScreen,
    landscape,
    fullMobileMap,
    currentPage,
    sidebarHidden
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const printClass = `ǹo-print${showPrintView ? ' sr-only' : ''}`;

  return (
    <ErrorProvider value={{ error, setError }}>
      {error && <ErrorComponent error={error} />}
      {!error && (
        <ErrorBoundary>
          <div id="topArea" aria-hidden={false} className={printClass}>
            <h1
              id="app-title"
              tabIndex={-1}
              className="sr-only app-title"
              component="h1"
            >
              <FormattedMessage id="app.title" />
            </h1>
            {/* Jump link to main content for screenreaders
              Must be first interactable element on page */}
            <FocusableSRLinks items={srLinks} />
            <PrintProvider value={togglePrint}>
              <TopBar smallScreen={isSmallScreen} />
            </PrintProvider>
          </div>
          {showPrintView && <PrintView togglePrintView={togglePrint} />}
          <div id="activeRoot" style={styles.activeRoot} className={printClass}>
            <main className="SidebarWrapper" style={styles.sidebar}>
              <AlertBox />
              <div style={styles.sidebarContent} aria-hidden={false}>
                <DefaultRoutes />
              </div>
            </main>
            <Typography style={visuallyHidden}>
              {intl.formatMessage({ id: 'map.ariaLabel' })}
            </Typography>
            <div aria-hidden tabIndex={-1} style={styles.map}>
              <Suspense fallback={<Loading />}>
                <MapView
                  sidebarHidden={sidebarHidden}
                  toggleSidebar={toggleSidebar}
                  isMobile={!!isMobile}
                />
              </Suspense>
            </div>
          </div>

          {isMobile ? (
            <>
              <BottomNav />
              <div style={styles.bottomAligner} />
            </>
          ) : null}

          <footer role="contentinfo" aria-hidden={false} className="sr-only">
            <DesktopComponent>
              <a href="#app-title">
                <FormattedMessage id="general.backToStart" />
              </a>
            </DesktopComponent>
          </footer>
        </ErrorBoundary>
      )}
    </ErrorProvider>
  );
}

export default DefaultLayout;
