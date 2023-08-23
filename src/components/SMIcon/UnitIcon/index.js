import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import UnitHelper from '../../../utils/unitHelper';

const UnitIcon = ({
  className, unit, settings,
}) => {
  const iconClass = `${className || ''}`;
  if (unit && settings) {
    return <StyledIcon alt="" src={UnitHelper.getIcon(unit, settings, true)} className={iconClass} aria-hidden="true" />;
  }
  return <StyledIcon alt="" src={UnitHelper.getDefaultIcon()} className={iconClass} aria-hidden="true" />;
};

const StyledIcon = styled('img')(() => ({
  height: 24,
}));

UnitIcon.propTypes = {
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

export default connect(mapStateToProps)(UnitIcon);
