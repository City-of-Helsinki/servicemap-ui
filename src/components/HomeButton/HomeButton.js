import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { intlShape } from 'react-intl';

const HomeButton = (props) => {
  const {
    className, intl, navigator,
  } = props;
  return (

    <IconButton
      role="link"
      className={className}
      aria-label={intl.formatMessage({ id: 'general.backToHome' })}
      onClick={(e) => {
        e.preventDefault();

        if (navigator) {
          navigator.push('home');
        }
      }}
    >
      <Close />
    </IconButton>
  );
};

HomeButton.propTypes = {
  className: PropTypes.string,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
};

HomeButton.defaultProps = {
  className: '',
  navigator: null,
};

export default HomeButton;
