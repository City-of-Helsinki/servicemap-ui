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
  let componentClasses = `${className || ''} ${classes.container} ${!backButton && !icon ? classes.textBar : ''}`;

  if (sticky) {
    const isMobile = useMobileStatus();
    componentClasses += `sticky ${isMobile ? classes.mobileSticky : classes.sticky}`;
  }


  return (
    <>
      <div className={componentClasses}>
        {
        backButton
        && (
          <BackButton
            onClick={backButtonOnClick}
            ariaLabel={backButtonSrText}
            className={classes.iconButton}
            variant="icon"
            focusVisibleClassName={classes.buttonFocus}
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
          aria-hidden={ariaHidden}
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
    </>
  );
};

TitleBar.propTypes = {
  backButton: PropTypes.bool,
  backButtonOnClick: PropTypes.func,
  backButtonSrText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.node.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  distance: PropTypes.string,
  ariaHidden: PropTypes.bool,
  sticky: PropTypes.bool,
};

TitleBar.defaultProps = {
  backButton: false,
  backButtonOnClick: null,
  backButtonSrText: null,
  icon: null,
  className: null,
  distance: null,
  ariaHidden: false,
  sticky: false,
};

export default TitleBar;
