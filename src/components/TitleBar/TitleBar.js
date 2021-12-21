import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';
import BackButton from '../BackButton';
import useMobileStatus from '../../utils/isMobile';

const TitleBar = ({
  backButton,
  backButtonOnClick,
  backButtonText,
  backButtonSrText,
  classes,
  title,
  titleComponent,
  icon,
  distance,
  className,
  ariaHidden,
  sticky,
}) => {
  const isMobile = useMobileStatus();
  let componentClasses = `${className || ''} ${classes.container} ${!backButton && !icon ? classes.textBar : ''} ${backButton ? classes.multiLine : ''} `;

  if (sticky) {
    componentClasses += `sticky ${isMobile ? classes.mobileSticky : classes.sticky}`;
  }


  return (
    <div className={componentClasses}>
      {
        backButton
        && (
        <BackButton
          onClick={backButtonOnClick}
          text={backButtonText}
          ariaLabel={backButtonSrText}
          className={classes.iconButton}
          focusVisibleClassName={classes.buttonFocus}
          variant="container"
        />
        )
      }
      {
        !backButton
        && icon
        && (
          <div className={classes.icon} aria-hidden="true">
            {icon}
          </div>
        )
      }
      <div className={classes.titleContainer}>
        <Typography
          aria-hidden={ariaHidden}
          className={`TitleText ${classes.title} ${backButton ? classes.titleLarge : ''}`}
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
  backButtonOnClick: PropTypes.func,
  backButtonText: PropTypes.string,
  backButtonSrText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.node.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  ariaHidden: PropTypes.bool,
  sticky: PropTypes.bool,
};

TitleBar.defaultProps = {
  backButton: false,
  backButtonOnClick: null,
  backButtonText: null,
  backButtonSrText: null,
  icon: null,
  className: null,
  distance: null,
  ariaHidden: false,
  sticky: false,
};

export default TitleBar;
