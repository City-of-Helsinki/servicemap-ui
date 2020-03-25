import React from 'react';
import PropTypes from 'prop-types';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import config from '../../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;

// Content wrapped with this component show only on Desktop widths
const DesktopComponent = ({ children }) => {
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

export default DesktopComponent;
