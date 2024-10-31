import React from 'react';
import PropTypes from 'prop-types';
import useMobileStatus from '../../utils/isMobile';


// Content wrapped with this component show only on Desktop widths
const DesktopComponent = ({ children }) => {
  const isMobile = useMobileStatus();
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
  children: PropTypes.node,
};

DesktopComponent.defaultProps = {
  children: null,
};

export default DesktopComponent;
