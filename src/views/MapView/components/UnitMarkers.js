/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { valuesHaveChanged } from '../../../utils';
import styles from '../styles';
import { getLocaleString } from '../../../redux/selectors/locale';

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
