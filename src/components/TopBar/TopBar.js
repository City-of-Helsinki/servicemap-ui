import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, NoSsr,
} from '@material-ui/core';
import { Map, Menu, Close } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HomeLogo from '../Logos/HomeLogo';
import DrawerMenu from './DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import LocaleUtility from '../../utils/locale';
import { useNavigationParams } from '../../utils/address';
import SettingsButton from './SettingsButton';

const TopBar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const locale = useSelector(state => state.user.locale);
  const location = useLocation();
  const getAddressNavigatorParams = useNavigationParams();

  const {
    settingsOpen,
    classes,
    toggleSettings,
    breadcrumb,
    intl,
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

  const renderMenuButton = () => (
    <Button
      id="MenuButton"
      aria-label={intl.formatMessage({ id: drawerOpen ? 'general.menu.close' : 'general.menu.open' })}
      aria-pressed={drawerOpen}
      className={drawerOpen ? classes.toolbarButtonPressed : classes.toolbarButton}
      classes={{ label: classes.buttonLabel }}
      onClick={() => toggleDrawerMenu()}
    >
      {drawerOpen ? (
        <>
          <Close />
          <Typography color="inherit" variant="body2">
            <FormattedMessage id="general.close" />
          </Typography>
        </>
      ) : (
        <>
          <Menu />
          <Typography color="inherit" variant="body2">
            <FormattedMessage id="general.menu" />
          </Typography>
        </>
      )}
    </Button>
  );

  const renderLanguages = (pageType) => {
    const typographyClass = className => `${pageType === 'mobile' ? classes.mobileFont : ''} ${className || ''}`;
    return (
      <>
        {LocaleUtility.availableLocales
          .map(currentLocale => (
            <ButtonBase
              role="link"
              key={currentLocale}
              focusVisibleClassName={classes.topButtonFocused}
              lang={currentLocale}
              onClick={() => {
                const newLocation = location;
                const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${currentLocale}/`);
                newLocation.pathname = newPath;
                window.location = `${newLocation.pathname}${newLocation.search}`;
              }}
            >
              <Typography
                className={typographyClass(
                  currentLocale === locale
                    ? classes.bold
                    : classes.greyText,
                )}
                color="inherit"
                variant="body2"
              >
                <FormattedMessage id={`general.language.${currentLocale}`} />
              </Typography>
            </ButtonBase>
          ))}
      </>
    );
  };

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
        if (currentPage !== 'home') {
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
    return (
      <>
        <AppBar className={classes.appBar}>
          {/* Toolbar black area */}
          <Toolbar className={toolbarBlackClass}>
            <div className={classes.toolbarBlackContainer}>
              <ButtonBase role="link" onClick={() => handleNavigation('home')} focusVisibleClassName={classes.topButtonFocused}>
                <Typography className={fontClass} color="inherit" variant="body2">
                  <FormattedMessage id="general.frontPage" />
                </Typography>
              </ButtonBase>
              <Typography aria-hidden color="inherit">|</Typography>
              {renderLanguages(pageType)}
              <Typography aria-hidden color="inherit">|</Typography>
              <ButtonBase role="button" onClick={() => handleContrastChange()} focusVisibleClassName={classes.topButtonFocused}>
                <Typography className={fontClass} color="inherit" variant="body2"><FormattedMessage id="general.contrast" /></Typography>
              </ButtonBase>
            </div>
          </Toolbar>

          {/* Toolbar white area */}
          <Toolbar disableGutters className={pageType === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <ButtonBase aria-hidden onClick={() => handleNavigation('home')}>
              <NoSsr>
                <HomeLogo aria-hidden contrast={theme === 'dark'} className={classes.logo} />
              </NoSsr>
            </ButtonBase>
            <MobileComponent>
              <div className={classes.mobileButtonContainer}>
                {renderMapButton()}
                {renderMenuButton()}
              </div>
              {renderDrawerMenu(pageType)}
            </MobileComponent>
            <DesktopComponent>
              {!smallScreen ? (
                <div className={classes.settingsButtonsContainer}>
                  <Typography component="h2" variant="srOnly">
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
              {
                !smallScreen && (
                  <ToolMenu />
                )
              }
            </DesktopComponent>
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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setMapType: PropTypes.func.isRequired,
  settingsOpen: PropTypes.string,
  smallScreen: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  toggleSettings: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  navigator: null,
  settingsOpen: null,
};

export default TopBar;
