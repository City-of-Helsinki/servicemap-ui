import React from 'react';
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
    menuItems={[]}
  >
    <SettingsDropdowns variant="ownSettings" />
  </MenuButton>
);

export default OwnSettingsMenuButton;
