import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

// Close suggestions button for suggestions dropdowns
export const CloseSuggestionButton = ({
  onClick,
  onKeyPress,
  onKeyDown,
  icon,
  srOnly,
  ...rest
}) => {
  const tabIndex = srOnly ? '-1' : '0';

  try {
    if (srOnly) {
      if (!onKeyPress) {
        throw Error('Missing onKeyPress prop for CloseSuggestionButton');
      }
      return (
        <Typography
          role="button"
          tabIndex={tabIndex}
          onClick={onClick}
          onKeyPress={onKeyPress}
          variant="srOnly"
          {...rest}
        >
          <FormattedMessage id="search.suggestions.hideButton" />
        </Typography>
      );
    }
    if (!onKeyDown) {
      throw Error('Missing onKeyDown prop for CloseSuggestionButton');
    }
    return (
      <div
        role="button"
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...rest}
      >
        <Typography variant="body2"><FormattedMessage id="search.suggestions.hideButton" /></Typography>
        {!!icon ? icon: null}
      </div>
    );
  } catch (e) {
    console.error(e);
  }
  return null;
}

CloseSuggestionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  icon: PropTypes.node,
  srOnly: PropTypes.bool,
};
