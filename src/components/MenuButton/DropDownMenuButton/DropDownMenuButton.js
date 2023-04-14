import React from 'react';
import PropTypes from 'prop-types';
import { Settings } from '@mui/icons-material';
import MapSettings from '../../MapSettings/MapSettings';
import MenuButton from '../MenuButton';

const DropDownMenuButton = ({ menuItems }) => (
  <MenuButton
    buttonIcon={<Settings />}
    buttonText="general.tools"
    id="ToolMenuButton"
    panelID="ToolMenuPanel"
    menuAriaLabel="general.tools"
    menuHeader="general.tools"
    menuItems={menuItems}
  >
    <MapSettings />
  </MenuButton>
);

DropDownMenuButton.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    button: PropTypes.string,
    menuItem: PropTypes.string,
    menuPanel: PropTypes.string,
    icon: PropTypes.string,
    iconRight: PropTypes.string,
  }).isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default DropDownMenuButton;