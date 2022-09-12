import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Map } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import { useNavigationParams } from '../../utils/address';
import SettingsButton from './SettingsButton';
import MenuButton from './MenuButton';
import SMLogo from './SMLogo';
import { isHomePage } from '../../utils/path';
import LanguageMenu from './LanguageMenu';

const TopBar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const intl = useIntl();
  const getAddressNavigatorParams = useNavigationParams();
  const isOnHomePage = isHomePage(location?.pathname);

  const {
    hideButtons,
    settingsOpen,
    classes,
    toggleSettings,
    breadcrumb,
    changeTheme,
    theme,
    setMapType,
    navigator,
    currentPage,
    smallScreen,
  } = props;

  const renderSettingsButtons = () => {
    const settingsCategories = [
      { type: 'citySettings' },
      { type: 'mapSettings' },
      { type: 'accessibilitySettings' },
    ];

    return (
      settingsCategories.map(category => (
        <SettingsButton
          key={category.type}
          onClick={() => {
            toggleSettings(category.type);
            setTimeout(() => {
              const button = document.getElementById(`SettingsButton${category.type}`);
              const settings = document.getElementsByClassName('TitleText')[0];
              if (settings) {
                // Focus on settings title
                settings.focus();
              } else {
                button.focus();
              }
            }, 1);
          }}
          settingsOpen={settingsOpen}
          type={category.type}
        />
      )));
  };

  const renderMapButton = () => {
    const mapPage = location.search.indexOf('showMap=true') > -1;
    return (
      <Button
        aria-current={mapPage ? 'page' : false}
        aria-hidden
        className={mapPage ? classes.toolbarButtonPressed : classes.toolbarButton}
        classes={{ label: classes.buttonLabel }}
        onClick={(e) => {
          e.preventDefault();
          if (settingsOpen) {
            toggleSettings();
          }
          if (mapPage) {
            navigator.closeMap(breadcrumb.length ? 'replace' : null);
          } else {
            navigator.openMap();
          }
        }}
      >
        <Map />
        <Typography color="inherit" variant="body2">
          <FormattedMessage id="map" />
        </Typography>
      </Button>
    );
  };

  const toggleDrawerMenu = () => {
    setTimeout(() => {
      setDrawerOpen(!drawerOpen);
    }, 1);
  };

  const renderMenuButton = pageType => (
    <MenuButton
      pageType={pageType}
      drawerOpen={drawerOpen}
      toggleDrawerMenu={() => toggleDrawerMenu()}
    />
  );

  const handleContrastChange = () => {
    changeTheme(theme === 'default' ? 'dark' : 'default');
    setMapType(theme === 'default' ? 'accessible_map' : 'servicemap');
  };

  const handleNavigation = (target, data) => {
    // Hide settings and map if open
    toggleSettings();
    if (location.search.indexOf('showMap=true') > -1) {
      navigator.closeMap();
    }

    switch (target) {
      case 'home':
        if (!isOnHomePage) {
          navigator.push('home');
        } else {
          setTimeout(() => {
            focusToViewTitle();
          }, 1);
        }
        break;

      case 'address':
        navigator.push('address', getAddressNavigatorParams(data));
        break;

      case 'services':
        if (currentPage !== 'serviceTree') {
          navigator.push('serviceTree');
        }
        break;

      case 'feedback':
        navigator.push('feedback');
        break;

      case 'info':
        navigator.push('info');
        break;

      default:
        break;
    }
  };

  const renderDrawerMenu = pageType => (
    <DrawerMenu
      isOpen={drawerOpen}
      pageType={pageType}
      toggleDrawerMenu={() => toggleDrawerMenu()}
      toggleSettings={toggleSettings}
      handleNavigation={handleNavigation}
    />
  );


  const renderTopBar = (pageType) => {
    const fontClass = pageType === 'mobile' ? classes.mobileFont : '';
    const toolbarBlackClass = `${
      classes.toolbarBlack
    } ${
      pageType === 'mobile' ? classes.toolbarBlackMobile : ''
    }`;
    const contrastAriaLabel = intl.formatMessage({ id: `general.contrast.ariaLabel.${theme === 'dark' ? 'off' : 'on'}` });
    return (
      <>
        <AppBar className={classes.appBar}>
          {/* Toolbar black area */}
          <Toolbar className={toolbarBlackClass}>
            <nav aria-label={intl.formatMessage({ id: 'app.navigation.language' })}>
              <div className={classes.toolbarBlackContainer}>
                <ButtonBase
                  aria-current={isOnHomePage ? 'page' : false}
                  role="link"
                  onClick={() => handleNavigation('home')}
                  focusVisibleClassName={classes.topButtonFocused}
                >
                  <Typography className={fontClass} color="inherit" variant="body2">
                    <FormattedMessage id="general.frontPage" />
                  </Typography>
                </ButtonBase>
                <Typography aria-hidden color="inherit">|</Typography>
                <LanguageMenu mobile={pageType === 'mobile'} />
                <Typography aria-hidden color="inherit">|</Typography>
                <ButtonBase role="button" onClick={() => handleContrastChange()} focusVisibleClassName={classes.topButtonFocused} aria-label={contrastAriaLabel}>
                  <Typography className={fontClass} color="inherit" variant="body2"><FormattedMessage id="general.contrast" /></Typography>
                </ButtonBase>
              </div>
            </nav>
          </Toolbar>

          {/* Toolbar white area */}
          <Toolbar disableGutters className={pageType === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <SMLogo onClick={() => handleNavigation('home')} />
            {hideButtons
              ? null
              : (
                <>
                  <MobileComponent>
                    <div className={classes.mobileButtonContainer}>
                      {renderMapButton()}
                      {renderMenuButton(pageType)}
                    </div>
                    {renderDrawerMenu(pageType)}
                  </MobileComponent>
                  <DesktopComponent>
                    <nav aria-label={intl.formatMessage({ id: 'app.navigation.settings' })} className={classes.settingsButtonsContainer}>
                      {!smallScreen ? (
                        <div className={classes.settingsButtonsContainer}>
                          <Typography component="h2" style={visuallyHidden}>
                            <FormattedMessage id="settings" />
                          </Typography>
                          {renderSettingsButtons()}
                        </div>
                      ) : (
                        <>
                          <div className={classes.mobileButtonContainer}>
                            {renderMenuButton()}
                          </div>
                          {renderDrawerMenu(pageType)}
                        </>
                      )}
                    </nav>
                    {
                      !smallScreen && (
                        <ToolMenu />
                      )
                    }
                  </DesktopComponent>
                </>
              )}
          </Toolbar>
        </AppBar>
        {/* This empty toolbar fixes the issue where App bar hides the top page content */}
        <Toolbar className={pageType === 'mobile' ? classes.alignerMobile : classes.aligner} />
      </>
    );
  };

  return (
    <>
      <MobileComponent>
        <>
          {renderTopBar('mobile')}
        </>
      </MobileComponent>
      <DesktopComponent>
        <>
          {renderTopBar('desktop')}
        </>
      </DesktopComponent>
    </>
  );
};

TopBar.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  changeTheme: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setMapType: PropTypes.func.isRequired,
  settingsOpen: PropTypes.string,
  smallScreen: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  hideButtons: PropTypes.bool,
};

TopBar.defaultProps = {
  navigator: null,
  settingsOpen: null,
  hideButtons: false,
};

export default TopBar;
