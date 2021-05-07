import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import logoNormal from '../../../assets/images/service-map-logo-fi.svg';
import logoContrast from '../../../assets/images/service-map-logo-contrast.svg';
import logoNormalDev from '../../../assets/images/service-map-logo-fi-dev.svg';
import logoContrastDev from '../../../assets/images/service-map-logo-contrast-dev.svg';
import logoEN from '../../../assets/images/Logo-ENG.svg';
import logoENContrast from '../../../assets/images/Logo-ENG-Contrast.svg';
import logoSV from '../../../assets/images/Logo-SWE.svg';
import logoSVContrast from '../../../assets/images/Logo-SWE-Contrast.svg';
import styles from './styles';
import config from '../../../../config';
import { useUserLocale } from '../../../utils/user';

const HomeLogo = (props) => {
  const {
    contrast, classes, ...rest
  } = props;
  const locale = useUserLocale();

  const getLogo = (production = false, contrast = false) => {
    if (production) {
      let logo = null;

      switch (locale) {
        case 'en':
          logo = contrast ? logoENContrast : logoEN;
          break;
        case 'sv':
          logo = contrast ? logoSVContrast : logoSV;
          break;
        case 'fi':
        default:
          logo = contrast ? logoContrast : logoNormal;
      }

      return logo;
    }
    return contrast ? logoContrastDev : logoNormalDev;
  };

  const logo = getLogo(config.production, contrast);

  return (
    <a {...rest} href={`/${locale}`}>
      <img src={logo} alt="" className={classes.icon} />
    </a>
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
