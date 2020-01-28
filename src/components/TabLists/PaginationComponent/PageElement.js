import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Typography, withStyles } from '@material-ui/core';
import { keyboardHandler } from '../../../utils';
import styles from './styles';

// Page number element
const PageElement = ({
  classes, className, intl, isActive, number, onClick, ...rest
}) => {
  const newClassName = `${className} ${classes.pageItem} ${isActive ? classes.pageElementActive : classes.pageElement}`;
  return (
    <li>
      <Typography
        variant="subtitle1"
        component="p"
        className={newClassName}
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
};

PageElement.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  isActive: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

PageElement.defaultProps = {
  className: '',
};

export default withStyles(styles)(PageElement);
