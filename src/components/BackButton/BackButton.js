import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';

const BackButton = (props) => {
  const {
    className, history, intl, style,
  } = props;
  return (

    <IconButton
      className={className}
      style={style}
      aria-label={intl.formatMessage({ id: 'general.back' })}
      onClick={(e) => {
        e.preventDefault();
        if (history) {
          history.goBack();
        }
      }}
    >
      <ArrowBack />
    </IconButton>
  );
};

BackButton.propTypes = {
  className: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

BackButton.defaultProps = {
  className: '',
  style: {},
};

export default injectIntl(withRouter(BackButton));
