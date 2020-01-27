import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {
  Typography, ButtonBase, Drawer, ClickAwayListener,
} from '@material-ui/core';
import { getIcon } from '../SMIcon';

const DrawerMenu = (props) => {
  const {
    classes,
    toggleSettings,
    userLocation,
    findUserLocation,
    intl,
    // currentPage,
    settingsOpen,
    pageType,
    isOpen,
    toggleDrawerMenu,
    handleNavigation,
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
        if (settingsOpen !== 'all') {
          toggleSettings('all');
        }
        toggleDrawerMenu();
      },
    },
    { // Instructions button
      name: intl.formatMessage({ id: 'home.buttons.instructions' }),
      disabled: true,
      icon: getIcon('help'),
      clickEvent: () => {},
    },
    { // Feedback button
      name: intl.formatMessage({ id: 'home.send.feedback' }),
      icon: getIcon('feedback'),
      clickEvent: () => window.open('https://forms.gle/roe9XNrZGQWBhMBJ7'),
    },
  ];

  return (
    <ClickAwayListener onClickAway={isOpen ? () => toggleDrawerMenu() : () => {}}>
      <Drawer
        variant="persistent"
        anchor="right"
        open={isOpen}
        classes={{ paper: pageType === 'mobile' ? classes.drawerContainerMobile : classes.drawerContainer }}
      >
        {menuContent.map(item => (
          <ButtonBase
            disableRipple
            key={item.name}
            tabIndex={isOpen ? 0 : -1}
            role="link"
            aria-hidden={!isOpen}
            onClick={item.clickEvent}
            className={`${classes.drawerButton} ${item.active ? classes.drawerButtonActive : ''}`}
          >
            <div className={`${classes.drawerIcon} ${item.active ? classes.drawerIconActive : ''} ${item.disabled ? classes.disabled : ''}`}>
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
};

DrawerMenu.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  // currentPage: PropTypes.string.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any).isRequired,
  findUserLocation: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  settingsOpen: PropTypes.string,
  pageType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDrawerMenu: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

DrawerMenu.defaultProps = {
  settingsOpen: null,
};

export default DrawerMenu;
