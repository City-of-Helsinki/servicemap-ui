import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@material-ui/core';
import isClient from '../../utils';

const DescriptionText = ({
  description, html, classes, title, titleComponent,
}) => {
  // Rendering only in client since dangerouslySetInnerHTML causes mismatch errors
  // between server and client HTML and not rendering anything on client side
  // TODO: Figure out a way to have server render description text identical to client
  if (description && isClient()) {
    return (
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
          <Typography dangerouslySetInnerHTML={{ __html: description }} className={classes.paragraph} variant="body2" />
        )}
      </div>
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
