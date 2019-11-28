import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, NoSsr,
} from '@material-ui/core';
import { Map, Menu } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import I18n from '../../i18n';
import HomeLogo from '../Logos/HomeLogo';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import { getIcon } from '../SMIcon';


class TopBar extends React.Component {
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
          <Typography variant="subtitle1" style={{ color: 'inherit' }}>
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
      classes, navigator, location, settingsOpen, toggleSettings,
    } = this.props;
    const mapPage = location.pathname.indexOf('/map') > -1;
    return (
      <Button
        className={mapPage ? classes.iconButtonPressed : classes.iconButton}
        classes={{ label: classes.buttonLabel }}
        onClick={(e) => {
          e.preventDefault();
          if (settingsOpen) {
            toggleSettings();
            navigator.push('map');
          } else if (mapPage) {
            navigator.goBack('home');
          } else {
            navigator.push('map');
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
    return (
      <Button
        className={classes.iconButton}
        classes={{ label: classes.buttonLabel }}
      >
        <Menu />
        <Typography color="inherit" variant="body2">
          <FormattedMessage id="general.menu" />
        </Typography>
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
              className={locale !== i18n.locale ? classes.greyText : ''}
              key={locale}
              onClick={() => {
                const newLocation = location;
                const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${locale}/`);
                newLocation.pathname = newPath;
                window.location = `${newLocation.pathname}${newLocation.search}`;
              }}
            >
              <Typography color="inherit">
                {i18n.localeText(locale)}
              </Typography>
            </ButtonBase>
          ))}
      </>
    );
  }

  navigateHome = () => {
    const { currentPage, navigator, toggleSettings } = this.props;
    toggleSettings();
    const viewTitle = document.getElementById('view-title');
    if (currentPage !== 'home') {
      navigator.push('home');
    } else if (viewTitle) {
      viewTitle.focus();
    }
  }

  renderTopBar = (type) => {
    const { classes, smallScreen } = this.props;
    return (
      <>
        <AppBar className={classes.appBar}>
          {/* Toolbar black area */}
          <Toolbar className={classes.toolbarBlack}>
            <div className={classes.toolbarBlackContainer}>
              <ButtonBase role="link" onClick={() => this.navigateHome()}>
                <Typography color="inherit">
                  <FormattedMessage id="general.frontPage" />
                </Typography>
              </ButtonBase>
              <Typography aria-hidden color="inherit">|</Typography>
              {this.renderLanguages()}
              <Typography aria-hidden color="inherit">|</Typography>
              {/* Contrast button implementation
                <ButtonBase role="link" onClick={() => console.log('change contrast')}>
                  <Typography color="inherit">Kontrasti</Typography>
                </ButtonBase> */}
            </div>
          </Toolbar>

          {/* Toolbar white area */}
          <Toolbar className={type === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <div className={classes.homeLogoContainer}>
              <HomeLogo mobile={type === 'mobile'} dark aria-hidden="true" className={classes.logo} />
            </div>
            <MobileComponent>
              <div className={classes.mobileButtonContainer}>
                {this.renderMapButton()}
                {/* {this.renderMenuButton()} */}
              </div>
            </MobileComponent>
            <DesktopComponent>
              <NoSsr>
                {!smallScreen ? (
                  <div className={classes.settingsButtonContainer}>
                    { this.renderSettingsButtons()}
                  </div>
                ) : (
                  <div className={classes.mobileButtonContainer}>
                    {/* {this.renderMenuButton()} */}
                  </div>
                )}
              </NoSsr>
            </DesktopComponent>
          </Toolbar>
        </AppBar>
        {/* This empty toolbar fixes the issue where App bar hides the top page content */}
        <Toolbar className={type === 'mobile' ? classes.alignerMobile : classes.aligner} />
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
  smallScreen: PropTypes.bool.isRequired,
};

TopBar.defaultProps = {
  i18n: null,
  navigator: null,
  settingsOpen: false,
};

export default TopBar;
