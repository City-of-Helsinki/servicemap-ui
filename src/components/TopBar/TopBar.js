import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, NoSsr,
} from '@material-ui/core';
import { Map, Menu, Close } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import HomeLogo from '../Logos/HomeLogo';
import { getIcon } from '../SMIcon';
import DrawerMenu from '../DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import config from '../../../config';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import LocaleUtility from '../../utils/locale';

const TopBar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    settingsOpen,
    classes,
    toggleSettings,
    settings,
    breadcrumb,
    intl,
    locale,
    location,
    changeTheme,
    theme,
    setMapType,
    getAddressNavigatorParams,
    navigator,
    currentPage,
    smallScreen,
  } = props;

  const renderSettingsButtons = () => {
    const citySettings = [];
    config.cities.forEach(city => citySettings.push(settings.cities[city]));
    const settingsCategories = [
      { type: 'citySettings', settings: citySettings },
      { type: 'mapSettings', settings: settings.mapType },
      { type: 'accessibilitySettings', settings: [settings.mobility, settings.colorblind, settings.hearingAid, settings.visuallyImpaired] },
    ];

    return (
      settingsCategories.map(category => (
        <Button
          id={`SettingsButton${category.type}`}
          key={`SettingsButton${category.type}`}
          aria-pressed={settingsOpen === category.type}
          className={settingsOpen === category.type
            ? classes.settingsButtonPressed
            : classes.settingsButton
                      }
          classes={{ label: classes.buttonLabel }}
          onClick={() => {
            toggleSettings(category.type);
            setTimeout(() => {
              const button = document.getElementById(`SettingsButton${category.type}`);
              const settings = document.getElementsByClassName('SettingsTitle')[0];
              if (settings) {
                // Focus on settings title
                settings.firstChild.focus();
              } else {
                button.focus();
              }
            }, 1);
          }}
        >
          <Typography component="p" variant="subtitle1" className={classes.settingsButtonText}>
            <FormattedMessage id={`settings.${category.type}`} />
          </Typography>
          {category.type === 'mapSettings'
            ? (
              <NoSsr>
                <span className={classes.iconTextContainer}>
                  {getIcon(category.settings, { className: classes.smallIcon })}
                  <Typography variant="body2">
                    <FormattedMessage id={`settings.map.${category.settings}`} />
                  </Typography>
                </span>
              </NoSsr>
            )
            : (
              <NoSsr>
                <Typography variant="body2">
                  <FormattedMessage id="settings.amount" values={{ count: category.settings.filter(i => (i !== false && i !== null)).length }} />
                </Typography>
              </NoSsr>
            )}
        </Button>
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
  getAddressNavigatorParams: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  locale: PropTypes.oneOf(config.supportedLanguages).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setMapType: PropTypes.func.isRequired,
  settingsOpen: PropTypes.string,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  smallScreen: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  toggleSettings: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  navigator: null,
  settingsOpen: null,
};

export default TopBar;
