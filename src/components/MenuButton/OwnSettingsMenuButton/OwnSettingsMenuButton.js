import React from 'react';
import PropTypes from 'prop-types';
import { AccountCircle } from '@mui/icons-material';
import SettingsDropdowns from '../../SettingsDropdowns';
import MenuButton from '../MenuButton';

const OwnSettingsMenuButton = () => (
  <MenuButton
    buttonIcon={<AccountCircle />}
    buttonText="general.ownSettings"
    id="SettingsMenuButton"
    menuAriaLabel="general.ownSettings"
    panelID="SettingsMenuPanel"
    menuHeader="general.ownSettings"
  >
    <SettingsDropdowns variant="ownSettings" />
  </MenuButton>
);

OwnSettingsMenuButton.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    button: PropTypes.string,
    menuItem: PropTypes.string,
    menuPanel: PropTypes.string,
    icon: PropTypes.string,
    iconRight: PropTypes.string,
  }).isRequired,
};

export default OwnSettingsMenuButton;
