import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar, ButtonBase, Drawer, ClickAwayListener,
} from '@material-ui/core';
import {
  Map, Menu, Close, GpsFixed, FormatListBulleted, Accessibility,
} from '@material-ui/icons';
import { FormattedMessage, intlShape } from 'react-intl';
import I18n from '../../i18n';
import HomeLogo from '../Logos/HomeLogo';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import fetchAddress from '../../views/MapView/utils/fetchAddress';


class TopBar extends React.Component {
  state={ drawerOpen: false }

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

  renderDrawerMenu = (pageType) => {
    const {
      classes, toggleSettings, userLocation, findUserLocation, intl,
    } = this.props;
    const { drawerOpen } = this.state;

    const menuContent = [
      {
        name: intl.formatMessage({ id: 'home.buttons.closeByServices' }),
        disabled: !userLocation.coordinates,
        subText: userLocation.allowed
          ? intl.formatMessage({ id: 'location.notFound' })
          : intl.formatMessage({ id: 'location.notAllowed' }),
        icon: <GpsFixed />,
        clickEvent: () => {
          if (!userLocation.coordinates) {
            findUserLocation();
          } else {
            this.handleNavigation('address', userLocation.coordinates);
            this.setState({ drawerOpen: false });
          }
        },
      },
      {
        name: intl.formatMessage({ id: 'home.buttons.services' }),
        icon: <FormatListBulleted />,
        clickEvent: () => {
          this.handleNavigation('services');
          this.setState({ drawerOpen: false });
        },
      },
      {
        name: intl.formatMessage({ id: 'home.buttons.settings' }),
        icon: <Accessibility />,
        clickEvent: () => {
          toggleSettings('all');
          this.setState({ drawerOpen: false });
        },
      },
      // {
      //   name: 'Vinkkejä Palvelukartan käyttöön',
      //   icon: <ThumbUp />,
      //   clickEvent: () => {
      //     this.setState({ drawerOpen: false });
      //   },
      // },
    ];

    return (
      <ClickAwayListener onClickAway={drawerOpen ? () => this.toggleDrawerMenu() : () => {}}>
        <Drawer
          variant="persistent"
          anchor="right"
          open={drawerOpen}
          classes={{ paper: pageType === 'mobile' ? classes.drawerContainerMobile : classes.drawerContainer }}
        >
          {menuContent.map(item => (
            <ButtonBase
              disableRipple
              key={item.name}
              tabIndex={drawerOpen ? 0 : -1}
              role="link"
              aria-hidden={!drawerOpen}
              onClick={item.clickEvent}
              className={classes.drawerButton}
            >
              <div className={`${classes.drawerIcon} ${item.disabled ? classes.disabled : ''}`}>
                {item.icon}
              </div>
              <span className={classes.buttonLabel}>
                <Typography className={`${classes.drawerButtonText} ${item.disabled ? classes.disabled : ''}`} variant="body1">{item.name}</Typography>
                {item.disabled && <Typography className={classes.drawerButtonText} variant="caption">{item.subText}</Typography>}
              </span>
            </ButtonBase>
          ))}
        </Drawer>
      </ClickAwayListener>
    );
  }

  handleNavigation = (target, data) => {
    const {
      getLocaleText, navigator, currentPage, toggleSettings,
    } = this.props;

    toggleSettings();

    if (target === 'home') {
      if (currentPage !== 'home') {
        navigator.push('home');
      } else {
        setTimeout(() => {
          document.getElementById('view-title').focus();
        }, 1);
      }
    } else if (target === 'address') {
      const latLng = { lat: data.latitude, lng: data.longitude };
      fetchAddress(latLng)
        .then((data) => {
          navigator.push('address', {
            municipality: data.street.municipality,
            street: getLocaleText(data.street.name),
            number: data.number,
          });
        });
    } else if (target === 'services') {
      navigator.push('serviceTree');
    }
  }


  toggleDrawerMenu = () => {
    const { drawerOpen } = this.state;
    setTimeout(() => {
      this.setState({ drawerOpen: !drawerOpen });
    }, 1);
  }

  renderTopBar = (pageType) => {
    const { classes } = this.props;
    return (
      <>
        <AppBar>
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
              {/* Contrast button implementation
                <ButtonBase role="link" onClick={() => console.log('change contrast')}>
                  <Typography color="inherit">Kontrasti</Typography>
                </ButtonBase> */}
            </div>
          </Toolbar>

          {/* Toolbar white area */}
          <Toolbar className={pageType === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <div className={classes.homeLogoContainer}>
              <HomeLogo mobile={pageType === 'mobile'} dark aria-hidden="true" className={classes.logo} />
            </div>
            <MobileComponent>
              <div className={classes.mobileButtonContainer}>
                {this.renderMapButton()}
                {this.renderMenuButton()}
              </div>
              {this.renderDrawerMenu(pageType)}
            </MobileComponent>
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
  settingsOpen: PropTypes.bool,
  toggleSettings: PropTypes.func.isRequired,
  currentPage: PropTypes.string.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any).isRequired,
  findUserLocation: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

TopBar.defaultProps = {
  i18n: null,
  navigator: null,
  settingsOpen: false,
};

export default TopBar;
