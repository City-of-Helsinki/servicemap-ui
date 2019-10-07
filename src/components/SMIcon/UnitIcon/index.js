import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import UnitHelper from '../../../utils/unitHelper';
import styles from './styles';

const UnitIcon = ({ classes, unit, settings }) => {
  if (unit && settings) {
    return <img alt="" src={UnitHelper.getIcon(unit, settings, true)} className={classes.icon} aria-hidden="true" />;
  }
  return null;
};

UnitIcon.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(UnitIcon));
