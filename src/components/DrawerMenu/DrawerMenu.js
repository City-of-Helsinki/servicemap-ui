import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
} from '@material-ui/core';
import { Map } from '@material-ui/icons';
import { getIcon } from '../SMIcon';
import DrawerButton from './DrawerButton';

const DrawerMenu = (props) => {
  const {
    classes,
    toggleSettings,
    userLocation,
    findUserLocation,
    intl,
    // currentPage,
    // settingsOpen,
    pageType,
    isOpen,
    toggleDrawerMenu,
    handleNavigation,
    getLocaleText,
  } = props;

  const menuContent = [
    { // Nearby services button
      name: intl.formatMessage({ id: 'home.buttons.closeByServices' }),
      // active: currentPage === 'address' && !settingsOpen,
      disabled: !userLocation.coordinates,
      subText: userLocation.allowed
        ? intl.formatMessage({ id: 'location.notFound' })
        : intl.formatMessage({ id: 'location.notAllowed' }),
      icon: getIcon('location'),
      clickEvent: () => {
        if (!userLocation.coordinates) {
          findUserLocation();
        } else {
          handleNavigation('address', userLocation.addressData);
          toggleDrawerMenu();
        }
      },
    },
    { // Service list button
      name: intl.formatMessage({ id: 'home.buttons.services' }),
      // active: currentPage === 'serviceTree' && !settingsOpen,
      icon: getIcon('serviceList'),
      clickEvent: () => {
        handleNavigation('services');
        toggleDrawerMenu();
      },
    },
    { // Settings button
      name: intl.formatMessage({ id: 'home.buttons.settings' }),
      // active: settingsOpen,
      icon: getIcon('accessibility'),
      clickEvent: () => {
        toggleSettings('mobile');
        toggleDrawerMenu();
      },
    },
    { // Instructions button
      name: intl.formatMessage({ id: 'info.title' }),
      icon: getIcon('help'),
      clickEvent: () => {
        handleNavigation('info');
        toggleDrawerMenu();
      },
    },
    { // Feedback button
      name: intl.formatMessage({ id: 'home.send.feedback' }),
      icon: getIcon('feedback'),
      clickEvent: () => {
        handleNavigation('feedback');
        toggleDrawerMenu();
      },
    },
    { // Link to old
      name: intl.formatMessage({ id: 'home.old.link' }),
      icon: <Map />,
      clickEvent: () => {
        window.open(getLocaleText({
          fi: 'https://palvelukartta-vanha.hel.fi/?lang=fi',
          sv: 'https://palvelukartta-vanha.hel.fi/?lang=sv',
          en: 'https://palvelukartta-vanha.hel.fi/?lang=en',
        }));
      },
    },
  ];

  return (
  // <ClickAwayListener onClickAway={isOpen ? () => toggleDrawerMenu() : () => {}}>
    <Drawer
      variant="persistent"
      anchor="right"
      open={isOpen}
      classes={{ paper: pageType === 'mobile' ? classes.drawerContainerMobile : classes.drawerContainer }}
    >
      {menuContent.map(item => (
        <DrawerButton
          active={item.active}
          disabled={item.disabled}
          disableRipple
          icon={item.icon}
          isOpen={isOpen}
          text={item.name}
          onClick={item.clickEvent}
          subText={item.subText}
        />
      ))}
    </Drawer>
  // </ClickAwayListener>
  );
};

DrawerMenu.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  // currentPage: PropTypes.string.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any).isRequired,
  findUserLocation: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  // settingsOpen: PropTypes.string,
  pageType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDrawerMenu: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

DrawerMenu.defaultProps = {
  // settingsOpen: null,
};

export default DrawerMenu;
