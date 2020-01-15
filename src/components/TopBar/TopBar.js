import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, NoSsr,
} from '@material-ui/core';
import { Map, Menu, Close } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import I18n from '../../i18n';
import HomeLogo from '../Logos/HomeLogo';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import { getIcon } from '../SMIcon';
import DrawerMenu from '../DrawerMenu';

class TopBar extends React.Component {
  state={ drawerOpen: false }

  renderSettingsButtons = () => {
    const {
      settingsOpen, classes, toggleSettings, settings,
    } = this.props;

    const settingsCategories = [
      { type: 'citySettings', settings: [settings.helsinki, settings.espoo, settings.vantaa, settings.kauniainen] },
      { type: 'mapSettings', settings: settings.mapType },
      { type: 'accessibilitySettings', settings: [settings.mobility, settings.colorblind, settings.hearingAid, settings.visuallyImpaired] },
    ];

    return (
      settingsCategories.map(category => (
        <Button
          id={`SettingsButton${category.type}`}
          key={`SettingsButton${category.type}`}
          aria-pressed={settingsOpen === category.type}
          disableFocusRipple
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
          <Typography variant="subtitle1" className={classes.settingsButtonText}>
            <FormattedMessage id={`settings.${category.type}`} />
          </Typography>
          {category.type === 'mapSettings'
            ? (
              <span className={classes.iconTextContainer}>
                {getIcon(category.settings, { className: classes.smallIcon })}
                <Typography>
                  <FormattedMessage id={`settings.map.${category.settings}`} />
                </Typography>
              </span>
            )
            : (
              <Typography>
                <FormattedMessage id="settings.amount" values={{ count: category.settings.filter(i => i !== false).length }} />
              </Typography>
            )}
        </Button>
      )));
  }

  renderMapButton = () => {
    const {
      classes, navigator, location, settingsOpen, toggleSettings, breadcrumb,
    } = this.props;
    const mapPage = location.search.indexOf('map=true') > -1;
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
    const { classes } = this.props;
    const { drawerOpen } = this.state;
    return (
      <Button
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

  renderLanguages = () => {
    const { classes, i18n, location } = this.props;
    return (
      <>
        {i18n.availableLocales
          .map(locale => (
            <ButtonBase
              role="link"
              key={locale}
              onClick={() => {
                const newLocation = location;
                const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${locale}/`);
                newLocation.pathname = newPath;
                window.location = `${newLocation.pathname}${newLocation.search}`;
              }}
            >
              <Typography className={locale === i18n.locale ? classes.bold : classes.greyText} color="inherit">
                {i18n.localeText(locale)}
              </Typography>
            </ButtonBase>
          ))}
      </>
    );
  }

  renderDrawerMenu = (pageType) => {
    const { drawerOpen } = this.state;
    const { toggleSettings, settingsOpen } = this.props;
    return (
      <DrawerMenu
        isOpen={drawerOpen}
        pageType={pageType}
        toggleDrawerMenu={this.toggleDrawerMenu}
        toggleSettings={toggleSettings}
        settingsOpen={settingsOpen}
        handleNavigation={this.handleNavigation}
      />
    );
  }

  handleContrastChange = () => {
    const { changeTheme, theme } = this.props;
    changeTheme(theme === 'default' ? 'dark' : 'default');
    window.location.reload();
  }

  handleNavigation = (target, data) => {
    const {
      getLocaleText, navigator, currentPage, toggleSettings, location,
    } = this.props;

    // Hide settings and map if open
    toggleSettings();
    if (location.search.indexOf('map=true') > -1) {
      navigator.closeMap();
    }

    switch (target) {
      case 'home':
        if (currentPage !== 'home') {
          navigator.push('home');
        } else {
          setTimeout(() => {
            document.getElementById('view-title').focus();
          }, 1);
        }
        break;

      case 'address':
        navigator.push('address', {
          municipality: data.street.municipality,
          street: getLocaleText(data.street.name),
          number: data.number,
        });
        break;

      case 'services':
        if (currentPage !== 'serviceTree') {
          navigator.push('serviceTree');
        }
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
    return (
      <>
        <AppBar className={classes.appBar}>
          {/* Toolbar black area */}
          <Toolbar className={classes.toolbarBlack}>
            <div className={classes.toolbarBlackContainer}>
              <ButtonBase role="link" onClick={() => this.handleNavigation('home')}>
                <Typography color="inherit">
                  <FormattedMessage id="general.frontPage" />
                </Typography>
              </ButtonBase>
              <Typography aria-hidden color="inherit">|</Typography>
              {this.renderLanguages()}
              <Typography aria-hidden color="inherit">|</Typography>
              <ButtonBase role="link" onClick={() => this.handleContrastChange()}>
                <Typography color="inherit"><FormattedMessage id="general.contrast" /></Typography>
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
              <NoSsr>
                {!smallScreen ? (
                  <div className={classes.settingsButtonsContainer}>
                    { this.renderSettingsButtons()}
                  </div>
                ) : (
                  <>
                    <div className={classes.mobileButtonContainer}>
                      {this.renderMenuButton()}
                    </div>
                    {this.renderDrawerMenu(pageType)}
                  </>
                )}
              </NoSsr>
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
  i18n: PropTypes.instanceOf(I18n),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  settingsOpen: PropTypes.string,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  currentPage: PropTypes.string.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  smallScreen: PropTypes.bool.isRequired,
  changeTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};

TopBar.defaultProps = {
  i18n: null,
  navigator: null,
  settingsOpen: null,
};

export default TopBar;
