
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Sidebar from '../views/Sidebar';
import MapContainer from '../views/Map/MapContainer';
import I18n from '../i18n';
import config from '../../config';
import { DesktopComponent } from './WrapperComponents/WrapperComponents';
import TopBar from '../components/TopBar';
import Settings from '../components/Settings';

// eslint-disable-next-line camelcase
const mobileBreakpoint = config.mobile_ui_breakpoint;
const smallScreenBreakpoint = config.small_screen_breakpoint;

const createContentStyles = (
  isMobile, isSmallScreen, landscape, mobileMapOnly, fullMobileMap, settingsOpen,
) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }
  const topBarHeight = '64px';

  const styles = {
    activeRoot: {
      flexDirection: mobileMapOnly || isMobile ? 'column' : 'row',
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: isMobile ? '100%' : 'calc(100vh - 64px)',
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
    },
    sidebar: {
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      overflow: !isMobile ? 'auto' : '',
      visibility: mobileMapOnly && !settingsOpen ? 'hidden' : null,
    },
    topNav: {
      minWidth: width,
    },
  };

  if (isMobile) {
    styles.sidebar.flex = '1 1 auto';
    if (fullMobileMap && !landscape) {
      // TODO change 56px to topBarHeight when we get new height for topbar/titlebar
      styles.map.height = 'calc(100% - 56px)';
    }
  }

  return styles;
};

const DefaultLayout = (props) => {
  const { i18n, location } = props;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const fullMobileMap = new URLSearchParams(location.search).get('map'); // If mobile map without bottom navigation & searchbar
  const mobileMapOnly = isMobile && (location.pathname.indexOf('/map') > -1 || fullMobileMap); // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');
  const portrait = useMediaQuery('(max-device-aspect-ratio: 1/1)');

  // State update for function component with react hook
  const [settingsOpen, setToggle] = useState(false);

  const styles = createContentStyles(
    isMobile, isSmallScreen, landscape, mobileMapOnly, fullMobileMap, settingsOpen,
  );


  return (
    <>
      <TopBar settingsOpen={settingsOpen} toggleSettings={() => setToggle(!settingsOpen)} topNav={styles.topNav} i18n={i18n} />
      <div style={styles.activeRoot}>
        <div className="SidebarWrapper" style={styles.sidebar}>
          {settingsOpen ? (
            <Settings toggleSettings={() => setToggle(false)} isMobile={!!isMobile} />
          ) : (
            <main style={{ height: '100%' }}>
              <Sidebar />
            </main>
          )}
        </div>
        <div aria-hidden style={styles.map}>
          <MapContainer isMobile={!!isMobile} />
        </div>
      </div>

      <footer role="contentinfo" className="sr-only">
        <DesktopComponent>
          <a href="#site-title">
            <FormattedMessage id="general.backToStart" />
          </a>
        </DesktopComponent>
      </footer>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  i18n: PropTypes.instanceOf(I18n),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

DefaultLayout.defaultProps = {
  i18n: null,
};

export default DefaultLayout;
