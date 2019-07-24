import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Typography } from '@material-ui/core';
import { keyboardHandler } from '../../../utils';

// Page number element
const PageElement = ({
  intl, isActive, number, onClick, ...rest
}) => (
  <li>
    <Typography
      variant="subtitle1"
      component="p"
      style={{
        color: isActive ? 'red' : 'black',
        cursor: isActive ? 'auto' : 'pointer',
        textDecoration: isActive ? 'underline' : 'none',
      }}
      role={!isActive ? 'link' : null}
      onClick={!isActive ? onClick : null}
      onKeyPress={!isActive ? keyboardHandler(onClick, ['space', 'enter']) : null}
      tabIndex={isActive ? null : '0'}
      {...rest}
    >
      <Typography variant="srOnly">
        {
          isActive
            ? intl.formatMessage({ id: 'general.pagination.currentlyOpenedPage' }, { count: number })
            : intl.formatMessage({ id: 'general.pagination.openPage' }, { count: number })
        }
      </Typography>
      <span aria-hidden="true">
        {number}
      </span>
    </Typography>
  </li>

);

PageElement.propTypes = {
  intl: intlShape.isRequired,
  isActive: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PageElement;
