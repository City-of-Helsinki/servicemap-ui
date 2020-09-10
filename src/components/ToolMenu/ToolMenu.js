import React from 'react';
import PropTypes from 'prop-types';
import {
  Build, GetApp,
} from '@material-ui/icons';
import DropDownMenuButton from '../DropDownMenuButton';
import useDownloadData from '../../utils/downloadData';

const ToolMenu = ({
  intl,
}) => {
  const downloadToolData = useDownloadData();
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
    {
      key: 'downloadTool',
      text: intl.formatMessage({ id: 'tool.download' }),
      icon: <GetApp />,
      onClick: () => {
        const content = JSON.stringify(downloadToolData, null, 2);
        const tab = window.open();
        tab.document.open();
        tab.document.write(`<html><body><pre style="white-space: pre;">${content}</pre></body></html>`);
        tab.document.close();
      },
    },
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
