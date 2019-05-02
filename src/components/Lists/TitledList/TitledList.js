import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import styles from './styles';

const TitledList = ({
  children, classes, title, titleComponent, divider,
}) => (
  <>
    <Typography
      className={`${classes.title} ${classes.left}`}
      component={titleComponent}
      variant="subtitle1"
    >
      {title}
    </Typography>
    {divider ? (
      <Divider aria-hidden="true" className={classes.left} />
    ) : null }

    <List disablePadding>
      {children}
    </List>
  </>
);

TitledList.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  divider: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

TitledList.defaultProps = {
  titleComponent: 'h3',
  divider: true,
};

export default withStyles(styles)(TitledList);
