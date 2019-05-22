import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';

const BackButton = (props) => {
  const {
    className, intl, onClick, style, variant, navigator,
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
          } else if (navigator) {
            navigator.goBack();
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
        } else if (navigator) {
          navigator.goBack();
        }
      }}
    >
      {intl.formatMessage({ id: 'general.back' })}

    </Button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['icon', null]),
};

BackButton.defaultProps = {
  className: '',
  navigator: null,
  style: {},
  onClick: null,
  variant: null,
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  null,
)(BackButton));
