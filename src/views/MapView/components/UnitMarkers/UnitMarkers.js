/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { valuesHaveChanged } from '../../../../utils';

const componentUpdatingProps = ['data'];

class UnitMarkers extends React.Component {
  shouldComponentUpdate(nextProps) {
    return valuesHaveChanged(this.props, nextProps, componentUpdatingProps);
  }

  render() {
    const {
      data, Polyline,
    } = this.props;

    const unitListFiltered = data.units.filter(unit => unit.object_type === 'unit');
    // Show markers with location
    return (
      <>
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
  data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  Polyline: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitMarkers.defaultProps = {
};

export default UnitMarkers;
