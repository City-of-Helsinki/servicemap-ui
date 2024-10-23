import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedAccessibilitySettings } from '../../../redux/selectors/settings';
import UnitHelper from '../../../utils/unitHelper';

const UnitIcon = ({ className = null, unit = null }) => {
  const selectedShortcomings = useSelector(selectSelectedAccessibilitySettings);
  const iconClass = `${className || ''}`;
  if (unit && !selectedShortcomings.length) {
    return <StyledIcon alt="" src={UnitHelper.getIcon(unit, selectedShortcomings, true)} className={iconClass} aria-hidden="true" />;
  }
  return <StyledIcon alt="" src={UnitHelper.getDefaultIcon()} className={iconClass} aria-hidden="true" />;
};

const StyledIcon = styled('img')(() => ({
  height: 24,
}));

UnitIcon.propTypes = {
  className: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
};

export default UnitIcon;
