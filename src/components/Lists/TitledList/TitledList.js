import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import styles from './styles';

const TitledList = ({
  children, classes, title, titleComponent,
}) => (
  <>
    <Typography
      className={`${classes.title} ${classes.left}`}
      component={titleComponent}
      variant="subtitle1"
    >
      {title}
    </Typography>

    <Divider aria-hidden="true" className={classes.left} />

    <List disablePadding>
      {children}
    </List>
  </>
);

TitledList.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

TitledList.defaultProps = {
  titleComponent: 'h3',
};

export default withStyles(styles)(TitledList);
