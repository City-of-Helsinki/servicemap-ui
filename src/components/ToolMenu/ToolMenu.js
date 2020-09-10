import React from 'react';
import PropTypes from 'prop-types';
import {
  Build, GetApp,
} from '@material-ui/icons';
import DropDownMenuButton from '../DropDownMenuButton';
import useDownloadData from '../../utils/downloadData';
import SMIcon from '../SMIcon/SMIcon';

const ToolMenu = ({
  intl, classes, setMeasuringMode, measuringMode,
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
    {
      key: 'measuringTool',
      text: measuringMode ? intl.formatMessage({ id: 'tool.measuring.stop' }) : intl.formatMessage({ id: 'tool.measuring' }),
      icon: <SMIcon className={classes.smIcon} icon="icon-icon-measuring-tool" />,
      ariaHidden: true,
      onClick: () => {
        setMeasuringMode(!measuringMode);
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
  setMeasuringMode: PropTypes.func.isRequired,
  measuringMode: PropTypes.bool.isRequired,
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
