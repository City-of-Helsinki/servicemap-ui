import { Settings } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';

import MapSettings from '../../MapSettings/MapSettings';
import MenuButton from '../MenuButton';

class DropDownMenuButton extends React.Component {
  render() {
    const { menuItems, innerRef, menuAriaLabel, buttonText } = this.props;
    return (
      <MenuButton
        ref={innerRef}
        buttonIcon={<Settings />}
        buttonText={buttonText}
        id="ToolMenuButton"
        dataSm="ToolMenuButton"
        panelID="ToolMenuPanel"
        menuAriaLabel={menuAriaLabel}
        menuHeader="general.tools"
        menuItems={menuItems}
      >
        <MapSettings />
      </MenuButton>
    );
  }
}

DropDownMenuButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  menuAriaLabel: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      id: PropTypes.string,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  innerRef: PropTypes.objectOf(PropTypes.any),
};

export default DropDownMenuButton;
