import { Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import config from '../../../../../config';
import {
  getAddressDistrict,
  getHighlightedDistrict,
  selectDistrictAddressData,
  selectDistrictDataBySelectedType,
  selectDistrictUnitFetch,
  selectSelectedDistrictType,
  selectSelectedParkingAreaIds,
  selectSelectedSubdistricts,
} from '../../../../redux/selectors/district';
import { selectMeasuringMode, selectNavigator } from '../../../../redux/selectors/general';
import { selectCities } from '../../../../redux/selectors/settings';
import { getPage, selectThemeMode } from '../../../../redux/selectors/user';
import { parseSearchParams } from '../../../../utils';
import { filterByCitySettings, resolveCitySettings } from '../../../../utils/filters';
import UnitHelper from '../../../../utils/unitHelper';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  geographicalDistricts,
  getCategoryDistricts,
} from '../../../AreaView/utils/districtDataHelper';
import { drawMarkerIcon } from '../../utils/drawIcon';
import swapCoordinates from '../../utils/swapCoordinates';
import AddressMarker from '../AddressMarker';
import ParkingAreas from './ParkingAreas';

const Districts = ({
  mapOptions,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  embedded,
}) => {
  const {
    Polygon, Marker, Tooltip, Popup,
  } = global.rL;
  const intl = useIntl();
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const navigator = useSelector(selectNavigator);
  const currentPage = useSelector(getPage);
  const measuringMode = useSelector(selectMeasuringMode);
  const highlightedDistrict = useSelector(getHighlightedDistrict);
  const addressDistrict = useSelector(getAddressDistrict);
  const districtData = useSelector(selectDistrictDataBySelectedType);
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const selectedAddress = useSelector(selectDistrictAddressData).address;
  const unitsFetching = useSelector(state => selectDistrictUnitFetch(state).isFetching);
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const citySettings = useSelector(selectCities);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const [areaPopup, setAreaPopup] = useState(null);

  const districtOnClick = (e, district) => {
    if (measuringMode) return;

    if (district.type === 'nature_reserve' && config.natureAreaURL !== 'undefined') {
      let link;
      if (district.municipality === 'vantaa') {
        link = `${config.vantaaNatureAreaURL}`;
      } else {
        link = `${config.natureAreaURL}${district.origin_id}`;
      }
    
      setAreaPopup({
        district,
        link,
        name: district.name,
        position: e.latlng,
      });
    }

    if (embedded) return;
    // Disable normal map click event
    e.originalEvent.view.L.DomEvent.stopPropagation(e);

    if (geographicalDistricts.includes(district.type)) {
      // Add/remove district from selected geographical districts
      let newArray;
      if (selectedSubdistricts.some(item => item === district.ocd_id)) {
        newArray = selectedSubdistricts.filter(i => i !== district.ocd_id);
      } else {
        newArray = [...selectedSubdistricts, district.ocd_id];
      }
      if (newArray.length === 0) {
        setSelectedDistrictServices([]);
      }
      setSelectedSubdistricts(newArray);
    }
  };

  const renderDistrictMarkers = (district) => {
    if (embedded && parseSearchParams(location.search).units === 'none') {
      return null;
    }

    const renderMarker = unit => (
      unit.location ? (
        <Marker
          customUnitData={unit}
          key={unit.id}
          position={[
            unit.location.coordinates[1],
            unit.location.coordinates[0],
          ]}
          icon={drawMarkerIcon(useContrast)}
          keyboard={false}
          eventHandlers={{
            click: () => {
              if (navigator) {
                UnitHelper.unitElementClick(navigator, unit);
              }
            },
          }}
        >
          <Tooltip
            direction="top"
            offset={[1.5, -25]}
            position={[
              unit.location.coordinates[1],
              unit.location.coordinates[0],
            ]}
          >
            <StyledPopupTypography noWrap>
              {getLocaleText(unit.name)}
            </StyledPopupTypography>
          </Tooltip>
        </Marker>
      ) : null
    );

    if (district.units?.length) return district.units.map(unit => (renderMarker(unit)));
    if (district.unit) return renderMarker(district.unit);
    return null;
  };

  const renderSingleDistrict = () => {
    if (!highlightedDistrict) {
      return null;
    }

    const areas = highlightedDistrict.boundary.coordinates.map(
      coords => swapCoordinates(coords),
    );

    return (
      <Polygon
        positions={[
          [mapOptions.polygonBounds],
          [areas],
        ]}
        color="#ff8400"
        pathOptions={{
          fillColor: '#000',
        }}
      />
    );
  };

  const renderMultipleDistricts = () => {
    const areasWithBoundary = districtData.filter(obj => obj.boundary);
    if (!areasWithBoundary.length) {
      return null;
    }
    const cityFilter = filterByCitySettings(resolveCitySettings(citySettings, location, embedded));
    const filteredData = areasWithBoundary
      .filter(cityFilter)
      .filter(district => {
        // In embed view, limit the rendered districts only to the selected ones
        if (!embedded || !geographicalDistricts.includes(district.type)) {
          return true;
        }
        if (!selectedSubdistricts.length) {
          return true;
        }
        return selectedSubdistricts.some(item => item === district.ocd_id);
      });

    return filteredData.map(district => {
      let dimmed;
      if (geographicalDistricts.includes(district.type)) {
        if (selectedSubdistricts.length) {
          dimmed = !selectedSubdistricts.some(item => item === district.ocd_id);
        }
      } else {
        dimmed = addressDistrict && district.id !== addressDistrict.id;
      }
      const area = district.boundary.coordinates.map(
        coords => swapCoordinates(coords),
      );

      // Count units in single area
      let numberOfUnits = district.overlapping?.length
        && district.overlapping.map(obj => obj.unit).filter(i => !!i).length;
      if (district.unit) {
        numberOfUnits += 1;
      }

      let tooltipTitle;

      if (numberOfUnits > 1) {
        tooltipTitle = `${intl.formatMessage({ id: `area.list.${district.type}` })} - ${intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count: numberOfUnits })}`;
      } else if (getCategoryDistricts('protection').includes(district.type)) {
        tooltipTitle = `${intl.formatMessage({ id: `area.list.${district.type}` })} ${district.origin_id} - ${getLocaleText(district.name)}`;
      } else if (district.name) {
        if (district.extra?.area_key) {
          tooltipTitle = `${intl.formatMessage({ id: 'parkingArea.popup.residentName' }, { letter: district.extra.area_key })} (${getLocaleText(district.name)}) - ${intl.formatMessage({ id: `area.list.${district.type}` })}`;
        } else {
          tooltipTitle = `${getLocaleText(district.name)} - ${intl.formatMessage({ id: `area.list.${district.type}` })}`;
        }
      }

      const mainColor = useContrast ? '#fff' : '#ff8400';

      return (
        <Polygon
          interactive={!unitsFetching}
          key={district.id}
          positions={[[area]]}
          color={mainColor}
          dashArray={useContrast ? '2, 10, 10, 10' : null}
          dashOffset="20"
          pathOptions={{
            fillOpacity: dimmed ? '0.3' : '0',
            fillColor: dimmed ? '#000' : mainColor,
          }}
          eventHandlers={{
            click: (e) => {
              districtOnClick(e, district);
            },
            mouseover: (e) => {
              e.target.openTooltip();
              e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: dimmed ? '0.3' : '0' });
            },
          }}
        >
          {tooltipTitle ? (
            <Tooltip
              sticky
              direction="top"
              autoPan={false}
            >
              {tooltipTitle}
            </Tooltip>
          ) : null}
        </Polygon>
      );
    });
  };

  const renderAreaPopup = () => (
    <Popup onClose={() => setAreaPopup(null)} position={areaPopup.position}>
      <StyledAreaPopup>
        <Typography>{getLocaleText(areaPopup.name)}</Typography>
        {areaPopup.link && (
          <StyledAreaLink href={areaPopup.link} target="_blank">
            <Typography><FormattedMessage id="area.popupLink" /></Typography>
          </StyledAreaLink>
        )}
      </StyledAreaPopup>
    </Popup>
  );


  useEffect(() => {
    setAreaPopup(null);
  }, [selectedDistrictType]);


  if (highlightedDistrict) {
    return (
      <>
        {
          renderSingleDistrict()
        }
        {
          embedded && parseSearchParams(location.search).units !== 'none' && (
            renderDistrictMarkers(highlightedDistrict)
          )
        }

      </>
    );
  }
  if (currentPage === 'area') {
    return (
      <>
        {selectedAddress ? (
          <AddressMarker
            Marker={Marker}
            Tooltip={Tooltip}
            getLocaleText={getLocaleText}
            position={[
              selectedAddress.location.coordinates[1], selectedAddress.location.coordinates[0],
            ]}
          />
        ) : null}
        {districtData ? (
          <>
            {renderMultipleDistricts()}
            {areaPopup && renderAreaPopup()}
          </>
        ) : null}
        {selectedParkingAreaIds.length ? (
          <ParkingAreas />
        ) : null}
      </>
    );
  } return null;
};

const StyledPopupTypography = styled(Typography)(() => ({
  padding: 12,
}));

const StyledAreaLink = styled(Link)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(0.5),
}));

const StyledAreaPopup = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5),
  paddingTop: 22,
  paddingBottom: 14,
  display: 'flex',
  flexDirection: 'column',
}));

Districts.propTypes = {
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedSubdistricts: PropTypes.func.isRequired,
  setSelectedDistrictServices: PropTypes.func.isRequired,
  embedded: PropTypes.bool.isRequired,
};

export default Districts;
