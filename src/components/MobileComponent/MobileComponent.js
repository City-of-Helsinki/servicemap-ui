import React from 'react';
import PropTypes from 'prop-types';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import config from '../../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;

// Content wrapped with this component show only on mobile widths
const MobileComponent = ({ children }) => {
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  if (isMobile && children) {
    return (
      <>
        {
          children
        }
      </>
    );
  }
  return null;
};

MobileComponent.propTypes = {
  children: PropTypes.node,
};

MobileComponent.defaultProps = {
  children: null,
};

export default MobileComponent;
