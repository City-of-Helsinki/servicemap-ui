import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@material-ui/core';

const DesciptionText = ({
  description, title, html, classes,
}) => {
  if (description) {
    return (
      <div className={classes.left}>
        <Typography
          className={classes.subtitle}
          component="h4"
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

DesciptionText.propTypes = {
  description: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  html: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

DesciptionText.defaultProps = {
  description: null,
  title: null,
  html: false,
};


export default DesciptionText;
