import { Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

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
import {
  selectMapRef,
  selectMeasuringMode,
  selectNavigator,
} from '../../../../redux/selectors/general';
import { selectCities } from '../../../../redux/selectors/settings';
import { getPage, selectThemeMode } from '../../../../redux/selectors/user';
import { parseSearchParams } from '../../../../utils';
import {
  filterByCitySettings,
  resolveCitySettings,
} from '../../../../utils/filters';
import UnitHelper from '../../../../utils/unitHelper';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  geographicalDistricts,
  getCategoryDistricts,
} from '../../../AreaView/utils/districtDataHelper';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { getBoundaryPolygons } from '../../utils/mapActions';
import swapCoordinates from '../../utils/swapCoordinates';
import AddressMarker from '../AddressMarker';
import ParkingAreas from './ParkingAreas';

function Districts({
  mapOptions,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  embedded,
}) {
  const { Polygon, Marker, Tooltip, Popup } = globalThis.rL;
  const intl = useIntl();
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const navigator = useSelector(selectNavigator);
  const currentPage = useSelector(getPage);
  const map = useSelector(selectMapRef);
  const measuringMode = useSelector(selectMeasuringMode);
  const highlightedDistrict = useSelector(getHighlightedDistrict);
  const addressDistrict = useSelector(getAddressDistrict);
  const districtData = useSelector(selectDistrictDataBySelectedType);
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const selectedAddress = useSelector(selectDistrictAddressData).address;
  const unitsFetching = useSelector(
    (state) => selectDistrictUnitFetch(state).isFetching
  );
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const citySettings = useSelector(selectCities);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const [areaPopup, setAreaPopup] = useState(null);

  const getSafeBoundary = (boundary) =>
    getBoundaryPolygons(boundary)
      .map((coords) => swapCoordinates(coords))
      .filter((coords) => Array.isArray(coords) && coords.length);

  const focusMapToDistrict = (district) => {
    if (!district?.boundary?.coordinates) {
      return;
    }

    try {
      const safeBounds = getSafeBoundary(district.boundary);
      if (safeBounds.length) {
        map.fitBounds(safeBounds);
      }
    } catch (err) {
      console.warn('Unable to fit district bounds', err);
    }
  };

  const openNatureAreaPopup = (event, district) => {
    if (
      district.type !== 'nature_reserve' ||
      config.natureAreaURL === 'undefined'
    ) {
      return;
    }

    const link =
      district.municipality === 'vantaa'
        ? config.vantaaNatureAreaURL
        : `${config.natureAreaURL}${district.origin_id}`;

    setAreaPopup({
      district,
      link,
      name: district.name,
      position: event.latlng,
    });
  };

  const districtOnClick = (e, district) => {
    if (measuringMode) return;

    focusMapToDistrict(district);
    openNatureAreaPopup(e, district);

    if (embedded) return;
    // Disable normal map click event
    e.originalEvent.view.L.DomEvent.stopPropagation(e);

    if (geographicalDistricts.includes(district.type)) {
      // Add/remove district from selected geographical districts
      let newArray;
      if (selectedSubdistricts.includes(district.ocd_id)) {
        newArray = selectedSubdistricts.filter((i) => i !== district.ocd_id);
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

    const renderMarker = (unit) =>
      unit.location ? (
        <Marker
          customUnitData={unit}
          key={unit.id}
          position={[
            unit.location.coordinates[1],
            unit.location.coordinates[0],
          ]}
          icon={drawMarkerIcon(undefined, undefined, useContrast)}
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
      ) : null;

    if (district.units?.length)
      return district.units.map((unit) => renderMarker(unit));
    if (district.unit) return renderMarker(district.unit);
    return null;
  };

  const renderSingleDistrict = () => {
    if (!highlightedDistrict) {
      return null;
    }

    const areas = getSafeBoundary(highlightedDistrict.boundary);
    if (!areas.length) {
      return null;
    }

    return (
      <Polygon
        positions={[[mapOptions.polygonBounds], [areas]]}
        color="#ff8400"
        pathOptions={{
          fillColor: '#000',
        }}
      />
    );
  };

  const isDistrictVisible = (district) => {
    if (!embedded || !geographicalDistricts.includes(district.type)) {
      return true;
    }
    return (
      !selectedSubdistricts.length ||
      selectedSubdistricts.includes(district.ocd_id)
    );
  };

  const getDistrictDimmed = (district) => {
    if (geographicalDistricts.includes(district.type)) {
      return (
        selectedSubdistricts.length &&
        !selectedSubdistricts.includes(district.ocd_id)
      );
    }
    return addressDistrict && district.id !== addressDistrict.id;
  };

  const getDistrictTooltipTitle = (district, numberOfUnits, areaTypeLabel) => {
    if (numberOfUnits > 1) {
      return `${areaTypeLabel} - ${intl.formatMessage(
        { id: 'map.unit.cluster.popup.info' },
        { count: numberOfUnits }
      )}`;
    }
    if (getCategoryDistricts('protection').includes(district.type)) {
      return `${areaTypeLabel} ${district.origin_id} - ${getLocaleText(district.name)}`;
    }
    if (!district.name) {
      return null;
    }
    if (district.extra?.area_key) {
      return `${intl.formatMessage(
        { id: 'parkingArea.popup.residentName' },
        { letter: district.extra.area_key }
      )} (${getLocaleText(district.name)}) - ${areaTypeLabel}`;
    }
    return `${getLocaleText(district.name)} - ${areaTypeLabel}`;
  };

  const renderMultipleDistricts = () => {
    const areasWithBoundary = districtData.filter((obj) => obj.boundary);
    if (!areasWithBoundary.length) {
      return null;
    }
    const cityFilter = filterByCitySettings(
      resolveCitySettings(citySettings, location, embedded)
    );
    const filteredData = areasWithBoundary
      .filter(cityFilter)
      .filter(isDistrictVisible);

    return filteredData.map((district) => {
      const dimmed = getDistrictDimmed(district);
      const safeArea = getSafeBoundary(district.boundary);
      if (!safeArea.length) {
        return null;
      }

      // Count units in single area
      let numberOfUnits =
        district.overlapping?.length &&
        district.overlapping.map((obj) => obj.unit).filter((i) => !!i).length;
      if (district.unit) {
        numberOfUnits += 1;
      }

      const areaTypeLabel = intl.formatMessage({
        id: `area.list.${district.type}`,
      });
      const tooltipTitle = getDistrictTooltipTitle(
        district,
        numberOfUnits,
        areaTypeLabel
      );

      const mainColor = useContrast ? '#fff' : '#ff8400';

      return (
        <Polygon
          interactive={!unitsFetching}
          key={district.id}
          positions={safeArea}
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
              e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: dimmed ? '0.3' : '0' });
            },
          }}
        >
          {tooltipTitle ? (
            <Tooltip sticky direction="top">
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
            <Typography>
              <FormattedMessage id="area.popupLink" />
            </Typography>
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
        {renderSingleDistrict()}
        {embedded &&
          parseSearchParams(location.search).units !== 'none' &&
          renderDistrictMarkers(highlightedDistrict)}
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
              selectedAddress.location.coordinates[1],
              selectedAddress.location.coordinates[0],
            ]}
          />
        ) : null}
        {districtData ? (
          <>
            {renderMultipleDistricts()}
            {areaPopup && renderAreaPopup()}
          </>
        ) : null}
        {selectedParkingAreaIds.length ? <ParkingAreas /> : null}
      </>
    );
  }
  return null;
}

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
