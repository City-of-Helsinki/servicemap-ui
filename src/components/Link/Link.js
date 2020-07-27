import React from 'react';
import PropTypes from 'prop-types';

const Link = ({
  children,
  className,
  classes,
  onClick,
}) => (
  <span
    className={`${classes.link} ${className || ''} link`}
    role="link"
    tabIndex="0"
    onClick={onClick}
    onKeyPress={onClick}
  >
    {children}
  </span>
);

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  classes: PropTypes.shape({
    link: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

Link.defaultProps = {
  className: null,
};

export default Link;
