import React from 'react';
import PropTypes from 'prop-types';
import useMobileStatus from '../../utils/isMobile';

// Content wrapped with this component show only on mobile widths
const MobileComponent = ({ children }) => {
  const isMobile = useMobileStatus();
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
