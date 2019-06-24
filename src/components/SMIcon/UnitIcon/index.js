import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UnitHelper from '../../../utils/unitHelper';

const UnitIcon = ({ unit, settings }) => {
  if (unit && settings) {
    return <img alt="" src={UnitHelper.getIcon(unit, settings, true)} style={{ height: 24 }} aria-hidden="true" />;
  }
  return null;
};

UnitIcon.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
  };
};

export default connect(
  mapStateToProps,
)(UnitIcon);
