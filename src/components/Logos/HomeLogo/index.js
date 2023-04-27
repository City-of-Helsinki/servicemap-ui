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

  const getLogo = (production = false, contrast = false, small = false) => {
    if (small) {
      return contrast ? IconPalvelukarttaContrast : IconPalvelukarttaPrimary;
    }
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
