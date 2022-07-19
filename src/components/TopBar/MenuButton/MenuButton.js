import { Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Close, Menu } from '@mui/icons-material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';


const MenuButton = ({
  classes, drawerOpen, pageType, toggleDrawerMenu,
}) => {
  const intl = useIntl();

  return (
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
