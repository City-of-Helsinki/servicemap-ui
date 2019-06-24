/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { drawMarkerIcon } from '../utils/drawIcon';
import { valuesHaveChanged } from '../../../utils';

const componentUpdatingProps = ['data', 'settings'];

class UnitMarkers extends React.Component {
  shouldComponentUpdate(nextProps) {
    return valuesHaveChanged(this.props, nextProps, componentUpdatingProps);
  }

  render() {
    const {
      data, navigator, Marker, settings,
    } = this.props;

    const unitListFiltered = data.filter(unit => unit.object_type === 'unit');

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
                    navigator.push('unit', unit.id);
                  }
                }}
                keyboard={false}
              />
            );
          } return null;
        })}
      </>
    );
  }
}

UnitMarkers.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};


// Listen to redux state
const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
  };
};

export default connect(
  mapStateToProps,
)(UnitMarkers);
