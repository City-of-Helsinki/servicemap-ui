import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase,
} from '@material-ui/core';
import { Map, Menu } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import I18n from '../../i18n';
import HomeLogo from '../Logos/HomeLogo';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';


class TopBar extends React.Component {
  renderMapButton = () => {
    const {
      classes, navigator, location, settingsOpen, toggleSettings,
    } = this.props;
    const mapPage = location.pathname.indexOf('/map') > -1;
    return (
      <Button
        className={mapPage ? classes.toolbarButtonPressed : classes.toolbarButton}
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
        className={classes.toolbarButton}
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
    const { currentPage, navigator } = this.props;
    if (currentPage !== 'home') {
      navigator.push('home');
    } else {
      document.getElementById('view-title').focus();
    }
  }

  renderTopBar = (type) => {
    const { classes } = this.props;

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
  settingsOpen: PropTypes.bool,
  toggleSettings: PropTypes.func.isRequired,
  currentPage: PropTypes.string.isRequired,
};

TopBar.defaultProps = {
  i18n: null,
  navigator: null,
  settingsOpen: false,
};

export default TopBar;
