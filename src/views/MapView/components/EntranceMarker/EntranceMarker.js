import { Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import distance from '@turf/distance';
import flip from '@turf/flip';
import { getSelectedUnit } from '../../../../redux/selectors/selectedUnit';
import useLocaleText from '../../../../utils/useLocaleText';
import { drawEntranceMarkreIcon } from '../../utils/drawIcon';

const EntranceMarker = ({ classes }) => {
  const getLocaleText = useLocaleText();
  const unit = useSelector(state => getSelectedUnit(state));
  const theme = useSelector(state => state.user.theme);

  const unitPoint = flip(unit.location);

  if (unit?.entrances?.length) {
    const { Marker, Popup } = global.rL || {};
    return (
      unit.entrances.map((entrance) => {
        const position = flip(entrance.location);
        const distanceBetween = distance(position, unitPoint) * 1000;
        // Don't show entrances that are too close to the unit marker
        if (distanceBetween < 1) {
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
                <Typography style={{ paddingTop: 4 }}>
                  {entrance.is_main_entrance ? (
                    'Pääsisäänkäynti'
                  ) : 'Lisäsisäänkäynti'}
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
