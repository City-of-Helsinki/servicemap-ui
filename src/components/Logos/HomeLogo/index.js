import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import logoNormal from '../../../assets/images/service-map-logo-fi.svg';
import logoContrast from '../../../assets/images/service-map-logo-contrast.svg';
import styles from './styles';

const HomeLogo = (props) => {
  const {
    contrast, classes, ...rest
  } = props;

  const logo = contrast ? logoContrast : logoNormal;

  return (
    <div role="img" {...rest}>
      <img src={logo} alt="" className={classes.icon} />
    </div>
  );
};


HomeLogo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  contrast: PropTypes.bool,
};

HomeLogo.defaultProps = {
  contrast: false,
};

export default withStyles(styles)(HomeLogo);
