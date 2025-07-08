import PropTypes from 'prop-types';
import React from 'react';

import useMobileStatus from '../../utils/isMobile';

// Content wrapped with this component show only on mobile widths
function MobileComponent({ children = null }) {
  const isMobile = useMobileStatus();
  if (isMobile && children) {
    return <>{children}</>;
  }
  return null;
}

MobileComponent.propTypes = {
  children: PropTypes.node,
};

export default MobileComponent;
