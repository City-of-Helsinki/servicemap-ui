import React from 'react';
import PropTypes from 'prop-types';
import logoLight from '../../../assets/images/service-map-logo-nega-fi_TEST.svg';
import logoDark from '../../../assets/images/service-map-logo-fi_TEST.svg';

const HomeLogo = (props) => {
  const { dark, ...rest } = props;
  if (dark) {
    return (
      <div role="img" {...rest}>
        <img src={logoDark} alt="" style={{ height: 36 }} />
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
};

HomeLogo.defaultProps = {
  dark: false,
};

export default HomeLogo;
