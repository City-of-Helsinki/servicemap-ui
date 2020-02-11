import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import { drawMarkerIcon } from '../utils/drawIcon';
import styles from '../styles';
import swapCoordinates from '../utils/swapCoordinates';

const Districts = ({
  Polygon,
  Marker,
  Popup,
  highlightedDistrict,
  getLocaleText,
  settings,
  mapOptions,
  mobile,
  classes,
  navigator,
}) => {
  const renderDistrictMarkers = () => {
    if (highlightedDistrict && highlightedDistrict.length) {
      return highlightedDistrict.map(district => (
        <React.Fragment key={district.id}>
          {district && district.unit && district.unit.location ? (
            <>
              <Marker
                position={[
                  district.unit.location.coordinates[1],
                  district.unit.location.coordinates[0],
                ]}
                icon={drawMarkerIcon(district.unit, settings)}
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
              />
              {/* Popup for the district unit name */}
              <Popup
                className="popup"
                offset={[-1, -29]}
                closeButton={false}
                autoPan={false}
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
              </Popup>
            </>
          )
            : null
          }
        </React.Fragment>
      ));
    }
    return null;
  };

  const renderDistricts = () => {
    if (!highlightedDistrict || !highlightedDistrict.length) {
      return null;
    }

    const areas = highlightedDistrict[0].boundary.coordinates.map(
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

  return (
    <>
      {
        renderDistricts()
      }
      {
        renderDistrictMarkers()
      }

    </>
  );
};

Districts.propTypes = {
  Polygon: PropTypes.objectOf(PropTypes.any).isRequired,
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  highlightedDistrict: PropTypes.arrayOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

Districts.defaultProps = {
  highlightedDistrict: null,
  mobile: false,
};

export default withStyles(styles)(Districts);
