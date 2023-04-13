import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import URI from 'urijs';
import {
  Code, GetApp, Print, Settings, AccountCircle,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import DropDownMenuButton from '../DropDownMenuButton';
import OwnSettingsMenuButton from '../OwnSettingsMenuButton';
import SMIcon from '../SMIcon/SMIcon';
import PrintContext from '../../context/PrintContext';
import DownloadDialog from '../Dialog/DownloadDialog';
import MeasuringStopButton from './MeasuringStopButton';

const ToolMenuButtonID = 'ToolMenuButton';
const SettingsMenuButtonID = 'SettingsMenuButton';

const ToolMenu = ({
  intl, classes, mapUtility, navigator, setMeasuringMode, measuringMode, currentPage,
}) => {
  const togglePrintView = useContext(PrintContext);
  const location = useLocation();
  const [openDownload, setOpenDownload] = React.useState(false);
  const toolMenuButton = React.useRef();
  const districtState = useSelector(state => state.districts);

  const getAreaViewParams = () => {
    // Form url with parameters when user clicks embedder from tool menu
    const {
      districtAddressData,
      selectedDistrictType,
      selectedSubdistricts,
      selectedDistrictServices,
      selectedParkingAreas,
      parkingUnits,
    } = districtState;
    const selected = selectedDistrictType
      ? `selected=${selectedDistrictType}` : null;
    const districts = selectedSubdistricts.length
      ? `districts=${selectedSubdistricts.map(i => i).toString()}` : null;
    const services = selectedDistrictServices.length
      ? `services=${selectedDistrictServices}` : null;
    const parkingSpaces = selectedParkingAreas.length
      ? `parkingSpaces=${selectedParkingAreas.join(',')}` : null;
    const units = parkingUnits.length
      ? 'parkingUnits=true' : null;
    const addressCoordinates = districtAddressData.address
      ? `lat=${districtAddressData.address.location.coordinates[1]}&lng=${districtAddressData.address.location.coordinates[0]}` : null;

    const params = [
      ...(selected ? [selected] : []),
      ...(districts ? [districts] : []),
      ...(services ? [services] : []),
      ...(parkingSpaces ? [parkingSpaces] : []),
      ...(units ? [units] : []),
      ...(addressCoordinates ? [addressCoordinates] : []),
    ];
    if (params.length) {
      return `?${params.join('&')}`;
    }
    return '';
  };

  // Open embedderView
  const openEmbedder = () => {
    if (!navigator || !mapUtility) {
      return;
    }
    const pathname = location.pathname.split('/');
    pathname.splice(2, 0, 'embedder');

    const uri = URI(window.location);
    const search = uri.search(true);
    uri.search(search);
    let searchParams = uri.search();

    if (currentPage === 'area') {
      searchParams = getAreaViewParams();
    }

    const newLocation = {
      ...location,
      pathname: pathname.join('/'),
      search: searchParams,
    };

    navigator.push(newLocation, null, ToolMenuButtonID);
  };

  const menuItems = [
    // Example shape
    {
      key: 'embedder.title',
      id: 'EmbedderToolMenuButton',
      text: intl.formatMessage({ id: 'embedder.title' }),
      icon: <Code />,
      onClick: () => {
        openEmbedder();
      },
      srText: intl.formatMessage({ id: 'general.open' }),
    },
    {
      key: 'downloadTool',
      id: 'DownloadToolMenuButton',
      text: intl.formatMessage({ id: 'tool.download' }),
      icon: <GetApp />,
      onClick: () => {
        setOpenDownload(true);
      },
    },
    {
      key: 'printTool',
      id: 'PrintToolMenuButton',
      text: intl.formatMessage({ id: 'tool.print' }),
      icon: <Print className={classes.smIcon} />,
      onClick: () => {
        if (typeof togglePrintView === 'function') {
          togglePrintView();
        }
      },
    },
    {
      key: 'measuringTool',
      id: 'MesuringToolMenuButton',
      text: measuringMode ? intl.formatMessage({ id: 'tool.measuring.stop' }) : intl.formatMessage({ id: 'tool.measuring' }),
      icon: <SMIcon className={classes.smIcon} icon="icon-icon-measuring-tool" />,
      ariaHidden: false,
      onClick: () => {
        setMeasuringMode(!measuringMode);
      },
    },
  ];

  if (menuItems.length === 0) {
    return null;
  }

  const settingsMenuText = intl.formatMessage({ id: 'general.ownSettings' });
  const mapToolsMenuText = intl.formatMessage({ id: 'general.tools' });

  return (
    <>
      <OwnSettingsMenuButton
        id={SettingsMenuButtonID}
        panelID="SettingsMenuPanel"
        buttonIcon={<AccountCircle />}
        buttonText={settingsMenuText}
        menuAriaLabel={settingsMenuText}
        menuItems={[]}
      />
      <DropDownMenuButton
        id={ToolMenuButtonID}
        ref={toolMenuButton}
        panelID="ToolMenuPanel"
        buttonIcon={<Settings />}
        buttonText={mapToolsMenuText}
        menuAriaLabel={mapToolsMenuText}
        menuItems={menuItems}
      />
      {measuringMode && (
        <MeasuringStopButton onClick={() => setMeasuringMode(false)} />
      )}
      <DownloadDialog open={openDownload} setOpen={setOpenDownload} referer={toolMenuButton} />
    </>
  );
};

ToolMenu.propTypes = {
  setMeasuringMode: PropTypes.func.isRequired,
  measuringMode: PropTypes.bool.isRequired,
  currentPage: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
    smIcon: PropTypes.string,
    measuringButton: PropTypes.string,
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
