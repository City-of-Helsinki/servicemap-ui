import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { drawMarkerIcon } from '../../utils/drawIcon';
import swapCoordinates from '../../utils/swapCoordinates';
import AddressMarker from '../AddressMarker';
import { parseSearchParams } from '../../../../utils';
import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import { geographicalDistricts, getCategoryDistricts } from '../../../AreaView/utils/districtDataHelper';
import UnitHelper from '../../../../utils/unitHelper';
import ParkingAreas from './ParkingAreas';


const Districts = ({
  highlightedDistrict,
  districtData,
  unitsFetching,
  addressDistrict,
  theme,
  mapOptions,
  currentPage,
  measuringMode,
  selectedAddress,
  selectedSubdistricts,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  embedded,
  classes,
  navigator,
  intl,
}) => {
  const {
    Polygon, Marker, Tooltip, Popup,
  } = global.rL;
  const useContrast = theme === 'dark';
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const citySettings = useSelector(state => state.settings.cities);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const selectedParkingAreas = useSelector(state => state.districts.selectedParkingAreas);
  const [areaPopup, setAreaPopup] = useState(null);

  const districtOnClick = (e, district) => {
    if (measuringMode) return;

    if (district.type === 'nature_reserve' && config.natureAreaURL !== 'undefined') {
      setAreaPopup({
        district,
        link: `${config.natureAreaURL}${district.origin_id}`,
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
      if (newArray === []) {
        setSelectedDistrictServices([]);
      }
      setSelectedSubdistricts(newArray);
    }
  };

  const renderDistrictMarkers = (district) => {
    if (embedded && parseSearchParams(location.search).units === 'none') {
      return null;
    }
    return (
      <React.Fragment key={district.id}>
        {district.unit && district.unit.location ? (
          <>
            <Marker
              customUnitData={district.unit}
              position={[
                district.unit.location.coordinates[1],
                district.unit.location.coordinates[0],
              ]}
              icon={drawMarkerIcon(useContrast)}
              keyboard={false}
              eventHandlers={{
                click: () => {
                  if (navigator) {
                    UnitHelper.unitElementClick(navigator, district.unit);
                  }
                },
              }
              }
            >
              <Tooltip
                direction="top"
                offset={[1.5, -25]}
                position={[
                  district.unit.location.coordinates[1],
                  district.unit.location.coordinates[0],
                ]}
              >
                <Typography
                  noWrap
                  className={classes.popup}
                >
                  {getLocaleText(district.unit.name)}
                </Typography>
              </Tooltip>
            </Marker>
          </>
        ) : null}
      </React.Fragment>
    );
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

    const selectedCities = Object.values(citySettings).filter(city => city);
    let filteredData = [];
    if (selectedCities.length) {
      const searchParams = parseSearchParams(location.search);
      filteredData = areasWithBoundary.filter(district => (searchParams.city
        ? embedded && district.municipality === searchParams.city
        : citySettings[district.municipality]));
    } else {
      filteredData = areasWithBoundary;
    }

    return filteredData.map((district) => {
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
          {renderDistrictMarkers(district)}
          {district.overlapping && district.overlapping.map(obj => (
            renderDistrictMarkers(obj)
          ))}
        </Polygon>
      );
    });
  };

  const renderAreaPopup = () => (
    <Popup onClose={() => setAreaPopup(null)} position={areaPopup.position}>
      <div className={classes.areaPopup}>
        <Typography>{getLocaleText(areaPopup.name)}</Typography>
        {areaPopup.link && (
          <Link className={classes.areaLink} href={areaPopup.link} target="_blank">
            <Typography><FormattedMessage id="area.popupLink" /></Typography>
          </Link>
        )}
      </div>
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
  } if (currentPage === 'area') {
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
        {selectedParkingAreas.length ? (
          <ParkingAreas />
        ) : null}
      </>
    );
  } return null;
};

Districts.propTypes = {
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  measuringMode: PropTypes.bool.isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  districtData: PropTypes.arrayOf(PropTypes.object),
  unitsFetching: PropTypes.bool.isRequired,
  addressDistrict: PropTypes.objectOf(PropTypes.any),
  selectedSubdistricts: PropTypes.arrayOf(PropTypes.string),
  setSelectedSubdistricts: PropTypes.func.isRequired,
  setSelectedDistrictServices: PropTypes.func.isRequired,
  embedded: PropTypes.bool.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.oneOf(['default', 'dark']).isRequired,
};

Districts.defaultProps = {
  highlightedDistrict: null,
  selectedAddress: null,
  districtData: null,
  addressDistrict: null,
  selectedSubdistricts: [],
};

export default Districts;
