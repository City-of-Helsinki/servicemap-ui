import React from 'react';
import PropTypes from 'prop-types';

const Link = ({
  children,
  className,
  classes,
  onClick,
  text,
}) => (
  <span
    className={`${classes.link} ${className || ''} ${text ? classes.blue : classes.default}`}
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
    link: PropTypes.object,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.bool,
};

Link.defaultProps = {
  className: null,
  text: false,
};

export default Link;
