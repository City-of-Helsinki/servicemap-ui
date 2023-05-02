import PropTypes from 'prop-types';
import { Close, Menu } from '@mui/icons-material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MobileNavButton from '../MobileNavButton/MobileNavButton';


const MenuButton = ({
  classes, drawerOpen, pageType, toggleDrawerMenu,
}) => {
  const intl = useIntl();

  return (
    <MobileNavButton
      id="MenuButton"
      aria-label={intl.formatMessage({ id: 'general.menu' })}
      aria-expanded={drawerOpen}
      aria-haspopup="true"
      className={`${pageType !== 'mobile' ? classes.largeButton : ''}`}
      classes={{ label: classes.buttonLabel }}
      onClick={() => toggleDrawerMenu()}
      icon={drawerOpen ? <Close /> : <Menu />}
      text={drawerOpen ? <FormattedMessage id="general.close" /> : <FormattedMessage id="general.menu" />}
    />
  );
};

MenuButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  toggleDrawerMenu: PropTypes.func.isRequired,
};

MenuButton.defaultProps = {
  pageType: null,
};

export default MenuButton;
