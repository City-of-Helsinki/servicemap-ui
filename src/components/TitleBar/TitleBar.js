import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import BackButton from '../BackButton';

const TitleBar = ({
  backButton, backText, classes, title, titleComponent, icon, distance, className,
}) => {
  const titleTextClasses = `
    ${classes.titleContainer} 
    ${backText ? classes.large : ''} 
    ${!backButton && !icon ? classes.textBar : ''}
    ${className || ''} 
  `;

  return (// Back arrow with text, on top of the title text
    <div className={classes.container}>
      {backText && (
        <div className={classes.backTextContainer}>
          <BackButton className={classes.iconButton} variant="icon" />
          <Typography color="inherit" className={classes.backText}>
            <FormattedMessage id="feedback.back" />
          </Typography>
        </div>
      )}

      <div className={titleTextClasses}>
        {backButton && (
          <BackButton
            className={classes.iconButton}
            variant="icon"
          />
        )}

        {!backButton && icon && (
          <div className={classes.iconButton} aria-hidden="true">
            {icon}
          </div>
        )}

        <Typography
          className={classes.title}
          component={titleComponent}
          tabIndex="-1"
        >
          {title}
        </Typography>

        {distance && (
          <Typography className={classes.distance}>
            {distance}
          </Typography>
        )}
      </div>
    </div>
  );
};

TitleBar.propTypes = {
  backButton: PropTypes.bool,
  backText: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.node.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  distance: PropTypes.string,
};

TitleBar.defaultProps = {
  backButton: false,
  backText: false,
  titleComponent: 'h3',
  icon: null,
  className: null,
  distance: null,
};

export default TitleBar;
