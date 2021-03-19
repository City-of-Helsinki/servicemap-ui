import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, NoSsr,
} from '@material-ui/core';
import { Map, Menu, Close } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import HomeLogo from '../Logos/HomeLogo';
import { getIcon } from '../SMIcon';
import DrawerMenu from './DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import config from '../../../config';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import LocaleUtility from '../../utils/locale';
import SettingsButton from './SettingsButton';

class TopBar extends React.Component {
  state={ drawerOpen: false }

  renderSettingsButtons = () => {
    const {
      settingsOpen, classes, toggleSettings, settings,
    } = this.props;
    const settingsCategories = [
      { type: 'citySettings' },
      { type: 'mapSettings'  },
      { type: 'accessibilitySettings' },
    ];

    return (
      settingsCategories.map(category => (
        <SettingsButton
          key={category.type}
          aria-pressed={settingsOpen === category.type}
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
          settingsOpen={settingsOpen}
          type={category.type}
        />
      )));
  }

  renderMapButton = () => {
    const {
      classes, navigator, location, settingsOpen, toggleSettings, breadcrumb,
    } = this.props;
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
  }

  renderMenuButton = () => {
    const { classes, intl } = this.props;
    const { drawerOpen } = this.state;
    return (
      <Button
        id="MenuButton"
        aria-label={intl.formatMessage({ id: drawerOpen ? 'general.menu.close' : 'general.menu.open' })}
        aria-pressed={drawerOpen}
        className={drawerOpen ? classes.toolbarButtonPressed : classes.toolbarButton}
        classes={{ label: classes.buttonLabel }}
        onClick={() => this.toggleDrawerMenu()}
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
  }

  renderLanguages = (pageType) => {
    const { classes, locale, location } = this.props;
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
  }

  renderDrawerMenu = (pageType) => {
    const { drawerOpen } = this.state;
    const { toggleSettings } = this.props;
    return (
      <DrawerMenu
        isOpen={drawerOpen}
        pageType={pageType}
        toggleDrawerMenu={() => this.toggleDrawerMenu()}
        toggleSettings={toggleSettings}
        handleNavigation={this.handleNavigation}
      />
    );
  }

  handleContrastChange = () => {
    const { changeTheme, theme, setMapType } = this.props;
    changeTheme(theme === 'default' ? 'dark' : 'default');
    setMapType(theme === 'default' ? 'accessible_map' : 'servicemap');
  }

  handleNavigation = (target, data) => {
    const {
      getAddressNavigatorParams, navigator, currentPage, toggleSettings, location,
    } = this.props;

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
  }


  toggleDrawerMenu = () => {
    const { drawerOpen } = this.state;
    setTimeout(() => {
      this.setState({ drawerOpen: !drawerOpen });
    }, 1);
  }

  renderTopBar = (pageType) => {
    const { classes, smallScreen, theme } = this.props;
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
              <ButtonBase role="link" onClick={() => this.handleNavigation('home')} focusVisibleClassName={classes.topButtonFocused}>
                <Typography className={fontClass} color="inherit" variant="body2">
                  <FormattedMessage id="general.frontPage" />
                </Typography>
              </ButtonBase>
              <Typography aria-hidden color="inherit">|</Typography>
              {this.renderLanguages(pageType)}
              <Typography aria-hidden color="inherit">|</Typography>
              <ButtonBase role="button" onClick={() => this.handleContrastChange()} focusVisibleClassName={classes.topButtonFocused}>
                <Typography className={fontClass} color="inherit" variant="body2"><FormattedMessage id="general.contrast" /></Typography>
              </ButtonBase>
            </div>
          </Toolbar>

          {/* Toolbar white area */}
          <Toolbar disableGutters className={pageType === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <ButtonBase aria-hidden onClick={() => this.handleNavigation('home')}>
              <NoSsr>
                <HomeLogo aria-hidden contrast={theme === 'dark'} className={classes.logo} />
              </NoSsr>
            </ButtonBase>
            <MobileComponent>
              <div className={classes.mobileButtonContainer}>
                {this.renderMapButton()}
                {this.renderMenuButton()}
              </div>
              {this.renderDrawerMenu(pageType)}
            </MobileComponent>
            <DesktopComponent>
              {!smallScreen ? (
                <div className={classes.settingsButtonsContainer}>
                  <Typography component="h2" variant="srOnly">
                    <FormattedMessage id="settings" />
                  </Typography>
                  {this.renderSettingsButtons()}
                </div>
              ) : (
                <>
                  <div className={classes.mobileButtonContainer}>
                    {this.renderMenuButton()}
                  </div>
                  {this.renderDrawerMenu(pageType)}
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
  }


  render() {
    return (
      <>
        <MobileComponent>
          <>
            {this.renderTopBar('mobile')}
          </>
        </MobileComponent>
        <DesktopComponent>
          <>
            {this.renderTopBar('desktop')}
          </>
        </DesktopComponent>
      </>
    );
  }
}

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
