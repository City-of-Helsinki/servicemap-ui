import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { drawMarkerIcon } from '../../utils/drawIcon';
import swapCoordinates from '../../utils/swapCoordinates';
import { focusDistrict } from '../../utils/mapActions';
import AddressMarker from '../AddressMarker';

const Districts = ({
  Polygon,
  Marker,
  Popup,
  Tooltip,
  highlightedDistrict,
  districtData,
  addressDistrict,
  getLocaleText,
  theme,
  mapOptions,
  mobile,
  currentPage,
  selectedAddress,
  map,
  classes,
  navigator,
  intl,
}) => {
  const useContrast = theme === 'dark';

  const renderDistrictMarkers = district => (
    <React.Fragment key={district.id}>
      {district.unit && district.unit.location ? (
        <>
          <Marker
            position={[
              district.unit.location.coordinates[1],
              district.unit.location.coordinates[0],
            ]}
            icon={drawMarkerIcon(useContrast)}
            keyboard={false}
            onClick={() => {
              if (navigator) {
                if (mobile) {
                  navigator.replace('unit', { id: district.unit.id });
                } else {
                  navigator.push('unit', { id: district.unit.id });
                }
              }
            }}
          >
            <Tooltip
            // className="popup"
              direction="top"
              offset={[1.5, -25]}
              // closeButton={false}
              // autoPan={false}
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
    if (!districtData) {
      return null;
    }

    return districtData.map((district) => {
      const dimmed = addressDistrict && district.id !== addressDistrict;


      const area = district.boundary.coordinates.map(
        coords => swapCoordinates(coords),
      );

      return (
        <Polygon
          key={district.id}
          positions={[
            [area],
          ]}
          color="#ff8400"
          fillOpacity={dimmed ? '0.3' : '0'}
          fillColor={dimmed ? '#000' : '#ff8400'}

          onClick={(e) => {
            e.originalEvent.view.L.DomEvent.stopPropagation(e);
            e.originalEvent.view.L.DomEvent.preventDefault(e);
            if (district.unit && !(district.overlaping && district.overlaping.some(obj => obj.unit))) {
              navigator.push('unit', { id: district.unit.id });
            }
          }}

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
              {`${district.name.fi} - ${intl.formatMessage({ id: `address.list.${district.type}` })}`}
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


  if (highlightedDistrict) {
    return (
      <>
        {
          renderSingleDistrict()
        }
        {
          renderDistrictMarkers(highlightedDistrict)
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
          renderMultipleDistricts()
        ) : null}
      </>
    );
  } return null;
};

Districts.propTypes = {
  Polygon: PropTypes.objectOf(PropTypes.any).isRequired,
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.oneOf(['default', 'dark']).isRequired,
};

Districts.defaultProps = {
  highlightedDistrict: null,
  mobile: false,
};

export default Districts;
