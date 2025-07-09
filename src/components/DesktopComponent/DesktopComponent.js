import PropTypes from 'prop-types';
import React from 'react';

import useMobileStatus from '../../utils/isMobile';

// Content wrapped with this component show only on Desktop widths
function DesktopComponent({ children = null }) {
  const isMobile = useMobileStatus();
  if (!isMobile && children) {
    return <>{children}</>;
  }
  return null;
}

DesktopComponent.propTypes = {
  children: PropTypes.node,
};

export default DesktopComponent;
