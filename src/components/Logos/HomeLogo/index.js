import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import logoNormal from '../../../assets/images/service-map-logo-fi.svg';
import logoContrast from '../../../assets/images/service-map-logo-contrast.svg';
import logoNormalDev from '../../../assets/images/service-map-logo-fi-dev.svg';
import logoContrastDev from '../../../assets/images/service-map-logo-contrast-dev.svg';
import styles from './styles';
import config from '../../../../config';

const HomeLogo = (props) => {
  const {
    contrast, classes, ...rest
  } = props;

  const getLogo = (environment, contrast = false) => {
    if (environment === 'production') {
      return contrast ? logoContrast : logoNormal;
    }
    return contrast ? logoContrastDev : logoNormalDev;
  };

  const logo = getLogo(config.environment, contrast);

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
