import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import logoNormal from '../../../assets/images/service-map-logo-fi.svg';
import logoContrast from '../../../assets/images/service-map-logo-contrast.svg';
import logoNormalDev from '../../../assets/images/service-map-logo-fi-dev.svg';
import logoContrastDev from '../../../assets/images/service-map-logo-contrast-dev.svg';
import logoEN from '../../../assets/images/Logo-ENG.svg';
import logoENContrast from '../../../assets/images/Logo-ENG-Contrast.svg';
import logoSV from '../../../assets/images/Logo-SWE.svg';
import logoSVContrast from '../../../assets/images/Logo-SWE-Contrast.svg';
import IconPalvelukarttaPrimary from '../../../assets/icons/IconPalvelukarttaPrimary.svg';
import IconPalvelukarttaContrast from '../../../assets/icons/IconPalvelukarttaContrast.svg';
import styles from './styles';
import config from '../../../../config';
import { useUserLocale } from '../../../utils/user';

const HomeLogo = React.forwardRef((props, ref) => {
  const {
    contrast, classes, small, ...rest
  } = props;
  const locale = useUserLocale();

  const getSmallLogo = contrast => (
    contrast ? IconPalvelukarttaContrast : IconPalvelukarttaPrimary
  );

  const getProductionLogo = (contrast) => {

    switch (locale) {
      case 'en':
        return contrast ? logoENContrast : logoEN;
      case 'sv':
        return contrast ? logoSVContrast : logoSV;
      case 'fi':
      default:
        return contrast ? logoContrast : logoNormal;
    }
  };

  const getDevLogo = contrast => (contrast ? logoContrastDev : logoNormalDev);

  const getLogo = (production = false, contrast = false, small = false) => {
    if (small) {
      return getSmallLogo(contrast);
    }
    if (production) {
      return getProductionLogo(contrast);
    }
    return getDevLogo(contrast);
  };

  const logo = getLogo(config.production, contrast, small);

  return (
    <div ref={ref} role="img" {...rest}>
      <img src={logo} alt="" className={classes.icon} />
    </div>
  );
});

HomeLogo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  contrast: PropTypes.bool,
  small: PropTypes.bool,
};

HomeLogo.defaultProps = {
  contrast: false,
  small: false,
};

export default withStyles(styles)(HomeLogo);
