import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, NoSsr } from '@material-ui/core';

const DescriptionText = ({
  description, html, classes, title, titleComponent,
}) => {
  // Hide linebreak html elements from screen readers
  const hideBRFromSR = text => text.replaceAll('<br>', '<br aria-hidden="true" />');

  if (description) {
    return (
      <NoSsr>
        <div className={classes.left}>
          <Typography
            className={classes.subtitle}
            component={titleComponent}
            variant="subtitle1"
          >
            {title}
          </Typography>
          <Divider className={classes.divider} aria-hidden="true" />
          { !html ? (
            <Typography className={classes.paragraph} variant="body2">
              {description}
            </Typography>
          ) : (
            <Typography dangerouslySetInnerHTML={{ __html: hideBRFromSR(description) }} className={classes.paragraph} variant="body2" />
          )}
        </div>
      </NoSsr>
    );
  } return null;
};

DescriptionText.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  html: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

DescriptionText.defaultProps = {
  html: false,
};


export default DescriptionText;
