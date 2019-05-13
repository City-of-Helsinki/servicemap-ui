import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { IconButton, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';

const BackButton = (props) => {
  const {
    className, history, intl, onClick, style, variant,
  } = props;

  if (variant === 'icon') {
    return (
      <IconButton
        role="link"
        className={className}
        style={style}
        aria-label={intl.formatMessage({ id: 'general.back' })}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick(e);
          } else if (history) {
            history.goBack();
          }
        }}
      >
        <ArrowBack />
      </IconButton>
    );
  }

  return (
    <Button
      role="link"
      variant="contained"
      color="primary"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(e);
        } else if (history) {
          history.goBack();
        }
      }}
    >
      {intl.formatMessage({ id: 'general.back' })}

    </Button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['icon', null]),
};

BackButton.defaultProps = {
  className: '',
  style: {},
  onClick: null,
  variant: null,
};

export default injectIntl(withRouter(BackButton));
