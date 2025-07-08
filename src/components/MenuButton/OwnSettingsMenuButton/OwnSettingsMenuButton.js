import { AccountCircle } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';

import SettingsDropdowns from '../../SettingsDropdowns';
import MenuButton from '../MenuButton';

class OwnSettingsMenuButton extends React.Component {
  render() {
    const { menuAriaLabel, buttonText } = this.props;
    return (
      <MenuButton
        buttonIcon={<AccountCircle />}
        buttonText={buttonText}
        id="SettingsMenuButton"
        dataSm="SettingsMenuButton"
        menuAriaLabel={menuAriaLabel}
        panelID="SettingsMenuPanel"
        menuHeader="general.ownSettings"
        menuItems={[]}
      >
        <SettingsDropdowns variant="ownSettings" />
      </MenuButton>
    );
  }
}

OwnSettingsMenuButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  menuAriaLabel: PropTypes.string.isRequired,
};
export default OwnSettingsMenuButton;
