import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import { drawMarkerIcon } from '../utils/drawIcon';
import styles from '../styles';

const Districts = ({
  Polygon, Marker, Popup, highlightedDistrict, getLocaleText, settings, mapOptions, mobile, classes,
}) => (
  <>
    {highlightedDistrict ? (
      <Polygon
        positions={[
          [mapOptions.polygonBounds],
          [highlightedDistrict.boundary.coordinates[0]],
        ]}
        color="#ff8400"
        fillColor="#000"
      />
    ) : null}
    {highlightedDistrict && highlightedDistrict.unit && highlightedDistrict.unit.location ? (
      <>
        <Marker
          position={[
            highlightedDistrict.unit.location.coordinates[1],
            highlightedDistrict.unit.location.coordinates[0],
          ]}
          icon={drawMarkerIcon(highlightedDistrict.unit, settings)}
          keyboard={false}
          onClick={() => {
            if (navigator) {
              if (mobile) {
                navigator.replace('unit', { id: highlightedDistrict.unit.id });
              } else {
                navigator.push('unit', { id: highlightedDistrict.unit.id });
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
            highlightedDistrict.unit.location.coordinates[1],
            highlightedDistrict.unit.location.coordinates[0],
          ]}
        >
          <Typography
            noWrap
            className={classes.popup}
          >
            {getLocaleText(highlightedDistrict.unit.name)}
          </Typography>
        </Popup>
      </>
    ) : null}
  </>
);

Districts.propTypes = {
  Polygon: PropTypes.objectOf(PropTypes.any).isRequired,
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  mapOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

Districts.defaultProps = {
  highlightedDistrict: null,
  mobile: false,
};

export default withStyles(styles)(Districts);
