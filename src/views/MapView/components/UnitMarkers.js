/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import { drawMarkerIcon } from '../utils/drawIcon';
import { valuesHaveChanged } from '../../../utils';
import styles from '../styles';
import { getLocaleString } from '../../../redux/selectors/locale';

const componentUpdatingProps = ['data', 'settings'];

class UnitMarkers extends React.Component {
  shouldComponentUpdate(nextProps) {
    return valuesHaveChanged(this.props, nextProps, componentUpdatingProps);
  }

  render() {
    const {
      classes, data, embeded, getLocaleText, navigator, Marker, Polyline, settings, Tooltip,
    } = this.props;

    const unitListFiltered = data.units.filter(unit => unit.object_type === 'unit');

    return (
      <>
        {unitListFiltered.map((unit) => {
          // Show markers with location
          if (unit && unit.location) {
            return (
              <Marker
                className="unitMarker"
                key={unit.id}
                position={[unit.location.coordinates[1], unit.location.coordinates[0]]}
                icon={drawMarkerIcon(unit, settings)}
                onClick={() => {
                  if (navigator) {
                    navigator.push('unit', { id: unit.id });
                  }
                }}
                keyboard={false}
              >
                {
                  // Show tooltip if showing single unit in embeded mode
                  embeded
                  && unitListFiltered.length === 1
                  && (
                    <Tooltip
                      className={classes.unitTooltip}
                      direction="top"
                      offset={[0, -36]}
                      permanent
                    >
                      {
                        unit.name
                        && (
                          <Typography variant="subtitle1">
                            {getLocaleText(unit.name)}
                          </Typography>

                        )
                      }
                      {
                        unit.street_address
                        && (
                          <Typography variant="body2">
                            {getLocaleText(unit.street_address)}
                          </Typography>
                        )
                      }
                    </Tooltip>
                  )
                }
              </Marker>
            );
          } return null;
        })}
        {data.unitGeometry && unitListFiltered.length === 1 && (
          <Polyline
            positions={[
              data.unitGeometry,
            ]}
            color="#ff8400"
          />
        )}
      </>
    );
  }
}

UnitMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  embeded: PropTypes.bool,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Tooltip: PropTypes.objectOf(PropTypes.any).isRequired,
  Polyline: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitMarkers.defaultProps = {
  embeded: false,
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, settings } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
    navigator,
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(UnitMarkers));
