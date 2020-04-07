import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, ButtonBase } from '@material-ui/core';
import styles from './styles';

// Page number element
const PageElement = ({
  classes, className, intl, isActive, number, onClick, ...rest
}) => {
  const newClassName = `${className} ${classes.pageItem} ${isActive ? classes.pageElementActive : classes.pageElement}`;
  return (
    <li>
      <ButtonBase
        role="link"
        disabled={isActive}
        onClick={onClick}
        tabIndex={isActive ? null : '0'}
      >
        <Typography
          variant="subtitle1"
          component="p"
          className={newClassName}
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
      </ButtonBase>
    </li>
  );
};

PageElement.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isActive: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

PageElement.defaultProps = {
  className: '',
};

export default withStyles(styles)(PageElement);
