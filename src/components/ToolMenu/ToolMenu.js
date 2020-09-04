import React from 'react';
import PropTypes from 'prop-types';
import { Build } from '@material-ui/icons';
import DropDownMenuButton from '../DropDownMenuButton';

const ToolMenu = ({
  intl
}) => {
  const menuItems = [
    // Example shape
    // {
    //   key: 'embedder.title',
    //   text: intl.formatMessage({ id: 'embedder.title' }),
    //   icon: <Code />,
    //   onClick: () => {
    //     openEmbedder();
    //   },
    //   srText: intl.formatMessage({ id: 'general.open' }),
    // },
  ];
  const toolMenuText = intl.formatMessage({ id: 'general.tools' });

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <>
      <DropDownMenuButton
        panelID="ToolMenuPanel"
        buttonIcon={<Build />}
        buttonText={toolMenuText}
        menuAriaLabel={toolMenuText}
        menuItems={menuItems}
      />
    </>
  );
};

ToolMenu.propTypes = {
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
  }).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ToolMenu.defaultProps = {
  navigator: null,
};

export default ToolMenu;
