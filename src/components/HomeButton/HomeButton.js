import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Home, Close } from '@material-ui/icons';
import { intlShape } from 'react-intl';

const HomeButton = (props) => {
  const {
    className, history, match, intl,
  } = props;
  const { params } = match;
  const lng = params && params.lng;
  return (

    <IconButton
      className={className}
      aria-label={intl.formatMessage({ id: 'general.home' })}
      onClick={(e) => {
        e.preventDefault();

        if (history) {
          history.push(`/${lng || 'fi'}/`);
        }
      }}
    >
      <Close />
    </IconButton>
  );
};

HomeButton.propTypes = {
  className: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

HomeButton.defaultProps = {
  className: '',
};

export default HomeButton;
