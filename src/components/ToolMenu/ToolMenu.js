import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import URI from 'urijs';
import {
  Build, Code, GetApp, Print,
} from '@material-ui/icons';
import DropDownMenuButton from '../DropDownMenuButton';
import useDownloadData from '../../utils/downloadData';
import SMIcon from '../SMIcon/SMIcon';
import SMButton from '../ServiceMapButton';
import PrintContext from '../../context/PrintContext';

const ToolMenu = ({
  intl, classes, mapUtility, navigator, setMeasuringMode, measuringMode,
}) => {
  const togglePrintView = useContext(PrintContext);
  const location = useLocation();

  // Open embedderView
  const openEmbedder = () => {
    if (!navigator || !mapUtility) {
      return;
    }
    const pathname = location.pathname.split('/');
    pathname.splice(2, 0, 'embedder');

    const uri = URI(window.location);
    const search = uri.search(true);
    if (!search.bbox) {
      search.bbox = mapUtility.getBbox();
    }
    uri.search(search);

    const newLocation = {
      ...location,
      pathname: pathname.join('/'),
      search: uri.search(),
    };

    navigator.push(newLocation);
  };
  const downloadToolData = useDownloadData();

  const menuItems = [
    // Example shape
    {
      key: 'embedder.title',
      text: intl.formatMessage({ id: 'embedder.title' }),
      icon: <Code />,
      onClick: () => {
        openEmbedder();
      },
      srText: intl.formatMessage({ id: 'general.open' }),
    },
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
    {
      key: 'printTool',
      text: 'Tulosta',
      icon: <Print className={classes.smIcon} />,
      ariaHidden: true,
      onClick: () => {
        if (typeof togglePrintView === 'function') {
          togglePrintView();
        }
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
      {measuringMode && (
        <SMButton
          aria-hidden="true"
          className={classes.measuringButton}
          color="primary"
          role="button"
          messageID="tool.measuring.stop"
          onClick={() => setMeasuringMode(false)}
        />
      )}
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
  mapUtility: PropTypes.shape({
    getBbox: PropTypes.func,
  }),
  navigator: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ToolMenu.defaultProps = {
  mapUtility: null,
  navigator: null,
};

export default ToolMenu;
