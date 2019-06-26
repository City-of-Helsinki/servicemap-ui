import React from 'react';
import PropTypes from 'prop-types';
import logoLight from '../../../assets/images/service-map-logo-nega-fi_TEST.svg';
import logoDark from '../../../assets/images/service-map-logo-fi_TEST.svg';
import logoMobile from '../../../assets/images/service-map-logo-nega-mobile.svg';

const HomeLogo = (props) => {
  const { dark, mobile, ...rest } = props;
  if (dark) {
    return (
      <div role="img" {...rest}>
        <img src={logoDark} alt="" style={{ marginTop: 12, marginBottom: 12, height: 45 }} />
      </div>
    );
  }
  if (mobile) {
    return (
      <div role="img" {...rest}>
        <img src={logoMobile} alt="" style={{ height: 45 }} />
      </div>
    );
  }
  return (
    <div role="img" {...rest}>
      <img src={logoLight} alt="" style={{ height: 36 }} />
    </div>
  );
};

HomeLogo.propTypes = {
  dark: PropTypes.bool,
  mobile: PropTypes.bool,
};

HomeLogo.defaultProps = {
  dark: false,
  mobile: false,
};

export default HomeLogo;
