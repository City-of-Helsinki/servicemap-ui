import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import logoLight from '../../../assets/images/service-map-logo-nega-fi_TEST.svg';
import logoDark from '../../../assets/images/service-map-logo-fi_TEST.svg';
import logoMobile from '../../../assets/images/service-map-logo-nega-mobile.svg';
import styles from './styles';

const HomeLogo = (props) => {
  const {
    dark, mobile, classes, ...rest
  } = props;
  if (mobile) {
    return (
      <div role="img" {...rest}>
        <img src={logoMobile} alt="" className={classes.iconMobile} />
      </div>
    );
  }
  if (dark) {
    return (
      <div role="img" {...rest}>
        <img src={logoDark} alt="" className={classes.iconDark} />
      </div>
    );
  }
  return (
    <div role="img" {...rest}>
      <img src={logoLight} alt="" className={classes.icon} />
    </div>
  );
};

HomeLogo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  dark: PropTypes.bool,
  mobile: PropTypes.bool,
};

HomeLogo.defaultProps = {
  dark: false,
  mobile: false,
};

export default withStyles(styles)(HomeLogo);
