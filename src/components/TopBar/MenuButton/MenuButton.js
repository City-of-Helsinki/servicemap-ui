import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Close, Menu } from '@material-ui/icons';
import React from 'react';
import { FormattedMessage } from 'react-intl';


const MenuButton = ({
  classes, intl, drawerOpen, pageType, toggleDrawerMenu,
}) => (
  <Button
    id="MenuButton"
    aria-label={intl.formatMessage({ id: 'general.menu' })}
    aria-expanded={drawerOpen}
    aria-haspopup="true"
    className={`${drawerOpen ? classes.toolbarButtonPressed : classes.toolbarButton} ${pageType !== 'mobile' ? classes.largeButton : ''}`}
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

MenuButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  toggleDrawerMenu: PropTypes.func.isRequired,
};

MenuButton.defaultProps = {
  pageType: null,
};

export default MenuButton;
