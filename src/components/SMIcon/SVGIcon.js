import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './styles';

const SVGIcon = ({
  className, classes, children, ...rest
}) => (
  <span aria-hidden="true" className={`${className}`} {...rest}>{children}</span>
);

SVGIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

SVGIcon.defaultProps = {
  className: '',
};

export default withStyles(styles)(SVGIcon);
