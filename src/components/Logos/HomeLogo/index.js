import React from 'react';
import PropTypes from 'prop-types';
import { HomeLogoDark, HomeLogoLight } from './HomeLogo';

const HomeLogo = (props) => {
  const { dark, ...rest } = props;
  console.log(rest);
  if (dark) {
    return (
      <div role="img" {...rest}>
        <HomeLogoDark />
      </div>
    );
  }
  return (
    <div role="img" {...rest}>
      <HomeLogoLight />
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
