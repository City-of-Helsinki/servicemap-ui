import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import distance from '@turf/distance';
import flip from '@turf/flip';
import { FormattedMessage } from 'react-intl';
import { getSelectedUnit } from '../../../../redux/selectors/selectedUnit';
import useLocaleText from '../../../../utils/useLocaleText';
import { drawEntranceMarkreIcon } from '../../utils/drawIcon';

const EntranceMarker = ({ classes }) => {
  const getLocaleText = useLocaleText();
  const unit = useSelector(state => getSelectedUnit(state));
  const theme = useSelector(state => state.user.theme);
  const map = useSelector(state => state.mapRef);

  const unitPoint = flip(unit.location);
  const zoomLimit = map.options.detailZoom;

  const shouldShowMarkers = () => map.getZoom() >= zoomLimit;
  const [showMarkers, setShowMarkers] = useState(shouldShowMarkers());

  const checkMarkerVisibility = () => {
    if (shouldShowMarkers()) {
      setShowMarkers(true);
    } else {
      setShowMarkers(false);
    }
  };

  useEffect(() => {
    // Add listener for zoom level to check if markers should be shown
    map.on('zoomend', checkMarkerVisibility);
    return () => {
      map.off('zoomend', checkMarkerVisibility);
    };
  }, []);


  if (unit?.entrances?.length && showMarkers) {
    const { Marker, Popup } = global.rL || {};
    return (
      unit.entrances.map((entrance) => {
        if (!entrance.location) return null;
        const position = flip(entrance.location);
        const distanceBetween = distance(position, unitPoint) * 1000;
        // Don't show entrances that are too close to the unit marker
        if (distanceBetween < 5) {
          return null;
        }
        const { coordinates } = position;

        return (
          <Marker
            key={`${coordinates[0]},${coordinates[1]}`}
            icon={drawEntranceMarkreIcon(theme === 'dark')}
            position={coordinates}
          >
            <Popup>
              <div className={classes.unitTooltipWrapper}>
                <Typography className={classes.unitTooltipTitle}>
                  {getLocaleText(unit.name)}
                </Typography>
                {entrance.name ? (
                  <Typography>
                    {getLocaleText(entrance.name)}
                  </Typography>
                ) : null}
                <Typography className={classes.entranceType}>
                  {entrance.is_main_entrance ? (
                    <FormattedMessage id="unit.entrances.main" />
                  ) : <FormattedMessage id="unit.entrances.secondary" />}
                </Typography>
              </div>
            </Popup>
          </Marker>
        );
      })
    );
  }
  return null;
};

EntranceMarker.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EntranceMarker;
