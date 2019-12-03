import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';
import BackButton from '../BackButton';

const TitleBar = ({
  backButton, classes, title, titleComponent, icon, distance, className,
}) => (
  <>
    <div className={`${className} ${classes.container} ${!backButton && !icon ? classes.textBar : ''}`}>

      {
        backButton
        && (
          <BackButton
            className={classes.iconButton}
            variant="icon"
          />
        )
      }
      {
        !backButton
        && icon
        && (
          <div className={classes.iconButton} aria-hidden="true">
            {icon}
          </div>
        )
      }
      <Typography
        className={classes.title}
        component={titleComponent}
        text={title}
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
  </>
);

TitleBar.propTypes = {
  backButton: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  distance: PropTypes.string,
};

TitleBar.defaultProps = {
  backButton: false,
  titleComponent: 'h3',
  icon: null,
  className: null,
  distance: null,
};

export default TitleBar;
