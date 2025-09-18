import styled from '@emotion/styled';
import { Code, GetApp, Print } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import URI from 'urijs';

import PrintContext from '../../context/PrintContext';
import {
  selectDistrictAddressData,
  selectParkingUnitsMap,
  selectSelectedDistrictServices,
  selectSelectedDistrictType,
  selectSelectedParkingAreaIds,
  selectSelectedSubdistricts,
} from '../../redux/selectors/district';
import {
  selectMapRef,
  selectMeasuringMode,
  selectNavigator,
} from '../../redux/selectors/general';
import { getPage } from '../../redux/selectors/user';
import DownloadDialog from '../Dialog/DownloadDialog';
import { DropDownMenuButton, OwnSettingsMenuButton } from '../MenuButton';
import SMIcon from '../SMIcon/SMIcon';
import MeasuringStopButton from './MeasuringStopButton';

const ToolMenuButtonID = 'ToolMenuButton';

function ToolMenu({ setMeasuringMode }) {
  const togglePrintView = useContext(PrintContext);
  const location = useLocation();
  const [openDownload, setOpenDownload] = React.useState(false);
  const toolMenuButton = React.useRef();
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const parkingUnits = useSelector(selectParkingUnitsMap);
  const selectedDistrictServices = useSelector(selectSelectedDistrictServices);
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const districtAddressData = useSelector(selectDistrictAddressData);
  const map = useSelector(selectMapRef);
  const navigator = useSelector(selectNavigator);
  const currentPage = useSelector(getPage);
  const measuringMode = useSelector(selectMeasuringMode);
  const intl = useIntl();

  const getAreaViewParams = () => {
    // Form url with parameters when user clicks embedder from tool menu
    const selected = selectedDistrictType
      ? `selected=${selectedDistrictType}`
      : null;
    const districts = selectedSubdistricts.length
      ? `districts=${selectedSubdistricts.map((i) => i).toString()}`
      : null;
    const services = selectedDistrictServices.length
      ? `services=${selectedDistrictServices}`
      : null;
    const parkingSpaces = selectedParkingAreaIds.length
      ? `parkingSpaces=${selectedParkingAreaIds.join(',')}`
      : null;
    const addressCoordinates = districtAddressData.address
      ? `lat=${districtAddressData.address.location.coordinates[1]}` +
        `&lng=${districtAddressData.address.location.coordinates[0]}`
      : null;

    const unitsParams = [];
    if (parkingUnits) {
      const keyMap = {
        'helsinki-531': 'parkingGarages=true',
        'vantaa-2204': 'sharedCarParking=true',
        'vantaa-2207': 'accessibleStreetParking=true',
      };

      Object.keys(parkingUnits).forEach((key) => {
        if (parkingUnits[key].length && keyMap[key]) {
          unitsParams.push(keyMap[key]);
        }
      });
    }
    const units = unitsParams.join('&');

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
    if (!navigator || !map) {
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
      icon: <StyledPrintIcon />,
      onClick: () => {
        if (typeof togglePrintView === 'function') {
          togglePrintView();
        }
      },
    },
    {
      key: 'measuringTool',
      id: 'MesuringToolMenuButton',
      text: measuringMode
        ? intl.formatMessage({ id: 'tool.measuring.stop' })
        : intl.formatMessage({ id: 'tool.measuring' }),
      icon: <StyledSMIcon icon="icon-icon-measuring-tool" />,
      ariaHidden: false,
      onClick: () => {
        setMeasuringMode(!measuringMode);
      },
    },
  ];

  return (
    <>
      <OwnSettingsMenuButton
        menuAriaLabel={intl.formatMessage({ id: 'general.ownSettings' })}
        buttonText={intl.formatMessage({ id: 'general.ownSettings' })}
      />
      <DropDownMenuButton
        innerRef={toolMenuButton}
        menuItems={menuItems}
        menuAriaLabel={intl.formatMessage({ id: 'general.tools' })}
        buttonText={intl.formatMessage({ id: 'general.tools' })}
      />
      {measuringMode && (
        <MeasuringStopButton onClick={() => setMeasuringMode(false)} />
      )}
      <DownloadDialog
        open={openDownload}
        setOpen={setOpenDownload}
        referer={toolMenuButton}
      />
    </>
  );
}

const iconClass = {
  margin: '0px !important',
  width: '24px !important',
  height: '24px !important',
};
const StyledPrintIcon = styled(Print)(() => iconClass);

const StyledSMIcon = styled(SMIcon)(() => iconClass);

ToolMenu.propTypes = {
  setMeasuringMode: PropTypes.func.isRequired,
};

export default ToolMenu;
