import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar,
} from '@material-ui/core';
import { Map, AccessibilityNew } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import I18n from '../../i18n';
import { generatePath } from '../../utils/path';
import HomeLogo from '../Logos/HomeLogo';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';


class TopBar extends React.Component {
  renderSettingsButton = () => {
    const { settingsOpen, toggleSettings, classes } = this.props;
    return (
      <Button
        id="SettingsButton"
        aria-pressed={settingsOpen}
        className={classes.button}
        classes={{ label: classes.buttonLabel }}
        style={settingsOpen ? { backgroundColor: '#4e67d2' } : null}
        color="inherit"
        onClick={(e) => {
          e.preventDefault();
          toggleSettings();

          setTimeout(() => {
            const button = document.getElementById('SettingsButton');
            const settings = document.getElementsByClassName('SettingsContent')[0];
            if (settings) {
              // Focus on settings title
              settings.firstChild.focus();
            } else {
              button.focus();
            }
          }, 1);
        }}
      >
        <AccessibilityNew style={{ marginRight: 8 }} />
        <Typography color="inherit" variant="body2">
          <FormattedMessage id="settings" />
        </Typography>
      </Button>
    );
  }

  renderDesktopBar = () => {
    const { classes, match, topNav } = this.props;
    const { params } = match;
    const lng = params && params.lng;

    return (
      <AppBar className={classes.desktopNav}>
        <Toolbar className={classes.toolbar}>
          <div style={topNav} className={classes.topNavLeft}>
            <div style={{ flex: '1 0 auto', display: 'flex' }}>
              {/* Jump link to main content for screenreaders
                  Must be first interactable element on page */}
              <a id="site-title" href="#view-title" className="sr-only">
                <Typography variant="srOnly">
                  <FormattedMessage id="general.skipToContent" />
                </Typography>
              </a>

              {/* Home logo link to home view */}
              <a href={generatePath('home', lng)} style={{ alignSelf: 'center' }} className="focus-dark-background">
                <HomeLogo aria-hidden="true" className={classes.logo} />
                <Typography className="sr-only" color="inherit" component="h1" variant="body1">
                  <FormattedMessage id="app.title" />
                </Typography>
              </a>
            </div>
            {this.renderLanguages()}
            {this.renderSettingsButton()}

          </div>
          <div className={classes.topNavRight}>
            <a href="https://forms.gle/roe9XNrZGQWBhMBJ7" rel="noopener noreferrer" target="_blank" style={{ display: 'inline-block' }}>
              <p style={{ margin: 0, color: 'white', textDecorationColor: 'white' }}>
                <FormattedMessage id="general.give.feedback" />
              </p>
            </a>
          </div>
        </Toolbar>
      </AppBar>
    );
  };

  renderMobileBar = () => {
    const {
      classes, location, navigator, settingsOpen, toggleSettings,
    } = this.props;
    const mapPage = location.pathname.indexOf('/map') > -1;

    if (location.pathname.length < 5 || location.pathname.indexOf('/map') > -1) {
      return (
        <AppBar className={classes.mobileNav}>
          <Toolbar className={classes.toolbar}>

            <div className={classes.topNavLeftMobile}>
              {/* TODO: remove this inline style once we get the correct icon */}
              <div style={{ paddingTop: 8, alignSelf: 'center' }}>
                <HomeLogo mobile aria-hidden="true" className={classes.logo} />
              </div>
              {this.renderLanguages()}
            </div>

            <div className={classes.topNavRightMobile}>
              {this.renderSettingsButton()}
              {/* Map button */}
              <Button
                className={classes.button}
                classes={{ label: classes.buttonLabel }}
                style={mapPage && !settingsOpen ? { backgroundColor: '#4e67d2' } : null}
                color="inherit"
                onClick={(e) => {
                  e.preventDefault();
                  if (settingsOpen) {
                    toggleSettings();
                    navigator.push('map');
                  } else if (mapPage) {
                    navigator.push('home');
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
            </div>

          </Toolbar>
        </AppBar>
      );
    } return (null);
  };

  renderLanguages = () => {
    const { classes, i18n, location } = this.props;
    return (
      <div className={classes.languages}>
        {i18n.availableLocales
          .filter(locale => locale !== i18n.locale)
          .map(locale => (
            <Button
              role="link"
              key={locale}
              color="inherit"
              variant="text"
              onClick={() => {
                const newLocation = location;
                const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${locale}/`);
                newLocation.pathname = newPath;
                window.location = `${newLocation.pathname}${newLocation.search}`;
              }}
            >
              <Typography color="inherit" variant="body2" style={{ textTransform: 'none' }}>
                {i18n.localeText(locale)}
              </Typography>
            </Button>
          ))}
      </div>
    );
  }

  render() {
    return (
      <>
        <MobileComponent>
          <>
            {this.renderMobileBar()}
          </>
        </MobileComponent>
        <DesktopComponent>
          <>
            {this.renderDesktopBar()}
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
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  topNav: PropTypes.objectOf(PropTypes.any).isRequired,
  settingsOpen: PropTypes.bool,
  toggleSettings: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  i18n: null,
  navigator: null,
  settingsOpen: false,
};

export default TopBar;
