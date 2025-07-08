import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

// Close suggestions button for suggestions dropdowns
export function CloseSuggestionButton({
  onClick,
  onKeyPress,
  onKeyDown,
  icon,
  srOnly,
  ...rest
}) {
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
          style={visuallyHidden}
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
        <Typography variant="body2">
          <FormattedMessage id="search.suggestions.hideButton" />
        </Typography>
        {icon || null}
      </div>
    );
  } catch (e) {
    console.error(e);
  }
  return null;
}

CloseSuggestionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  icon: PropTypes.node,
  srOnly: PropTypes.bool,
};
