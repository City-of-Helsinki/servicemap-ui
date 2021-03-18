import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { drawMarkerIcon } from '../../utils/drawIcon';
import swapCoordinates from '../../utils/swapCoordinates';
import AddressMarker from '../AddressMarker';
import useMobileStatus from '../../../../utils/isMobile';
import { parseSearchParams } from '../../../../utils';
import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import { geographicalDistricts } from '../../../AreaView/utils/districtDataHelper';


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
  embed,
  classes,
  navigator,
  intl,
}) => {
  const {
    Polygon, Marker, Tooltip, Popup,
  } = global.rL;
  const useContrast = theme === 'dark';
  const isMobile = useMobileStatus();
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const citySettings = useSelector(state => state.settings.cities);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const [areaPopup, setAreaPopup] = useState(null);

  const districtOnClick = (e, district) => {
    if (measuringMode) return;
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
    } else if (district.category === 'nature') {
      if (config.natureAreaURL === 'undefined') return;
      setAreaPopup({
        district,
        link: `${config.natureAreaURL}${district.origin_id}`,
        name: district.name,
        position: e.latlng,
      });
    }
  };

  const renderDistrictMarkers = (district) => {
    if (embed && parseSearchParams(location.search).units === 'none') {
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
              onClick={() => {
                if (navigator) {
                  if (isMobile) {
                    navigator.replace('unit', { id: district.unit.id });
                  } else {
                    navigator.push('unit', { id: district.unit.id });
                  }
                }
              }}
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
        fillColor="#000"
      />
    );
  };

  const renderMultipleDistricts = () => {
    if (!districtData[0]?.boundary) {
      return null;
    }

    const selectedCities = Object.values(citySettings).filter(city => city);
    let filteredData = [];
    if (selectedCities.length) {
      const searchParams = parseSearchParams(location.search);
      filteredData = districtData.filter(district => (searchParams.city
        ? embed && district.municipality === searchParams.city
        : citySettings[district.municipality]));
    } else {
      filteredData = districtData;
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

      return (
        <Polygon
          interactive={!unitsFetching}
          key={district.id}
          onClick={e => districtOnClick(e, district)}
          positions={[[area]]}
          color="#ff8400"
          fillOpacity={dimmed ? '0.3' : '0'}
          fillColor={dimmed ? '#000' : '#ff8400'}
          onMouseOver={(e) => {
            e.target.openTooltip();
            e.target.setStyle({ fillOpacity: '0.2' });
          }}
          onMouseOut={(e) => {
            e.target.setStyle({ fillOpacity: dimmed ? '0.3' : '0' });
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {district.name && !(district.overlaping && district.overlaping.some(obj => obj.unit)) ? (
            <Tooltip
              sticky
              direction="top"
              autoPan={false}
            >
              {`${getLocaleText(district.name)} - ${intl.formatMessage({ id: `area.list.${district.type}` })}`}
            </Tooltip>
          ) : null}
          {renderDistrictMarkers(district)}
          {district.overlaping && district.overlaping.map(obj => (
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
          embed && parseSearchParams(location.search).units !== 'none' && (
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
  embed: PropTypes.bool.isRequired,
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
