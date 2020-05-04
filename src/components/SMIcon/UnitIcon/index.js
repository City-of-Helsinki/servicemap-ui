import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import UnitHelper from '../../../utils/unitHelper';
import styles from './styles';

const UnitIcon = ({
  classes, className, unit, settings,
}) => {
  const iconClass = `${classes.icon} ${className || ''}`;
  if (unit && settings) {
    return <img alt="" src={UnitHelper.getIcon(unit, settings, true)} className={iconClass} aria-hidden="true" />;
  }
  return <img alt="" src={UnitHelper.getDefaultIcon()} className={iconClass} aria-hidden="true" />;
};

UnitIcon.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any),
};

UnitIcon.defaultProps = {
  className: null,
  unit: null,
  settings: null,
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
