import React from 'react';
import PropTypes from 'prop-types';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import config from '../../../config';

// eslint-disable-next-line camelcase
const mobileBreakpoint = config.mobile_ui_breakpoint;

export const MobileComponent = ({ children }) => {
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
  children: PropTypes.node.isRequired,
};

export const DesktopComponent = ({ children }) => {
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  if (!isMobile && children) {
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

DesktopComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MobileComponent;
