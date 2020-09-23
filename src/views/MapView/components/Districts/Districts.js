import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { drawMarkerIcon } from '../../utils/drawIcon';
import swapCoordinates from '../../utils/swapCoordinates';
import AddressMarker from '../AddressMarker';
import useMobileStatus from '../../../../utils/isMobile';

const Districts = ({
  highlightedDistrict,
  districtData,
  addressDistrict,
  getLocaleText,
  theme,
  mapOptions,
  currentPage,
  selectedAddress,
  classes,
  navigator,
  intl,
}) => {
  const { Polygon, Marker, Tooltip } = global.rL;
  const useContrast = theme === 'dark';
  const isMobile = useMobileStatus();

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
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  districtData: PropTypes.arrayOf(PropTypes.object),
  addressDistrict: PropTypes.number,
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
};

export default Districts;
