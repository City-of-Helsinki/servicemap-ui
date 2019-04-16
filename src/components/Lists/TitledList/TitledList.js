import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import styles from './styles';

const TitledList = ({ children, classes, title }) => (
  <>
    <Typography
      className={`${classes.title} ${classes.left}`}
      component="h4"
      variant="subtitle1"
    >
      {title}
    </Typography>

    <Divider className={classes.left} />

    <List disablePadding>
      {children}
    </List>
  </>
);

TitledList.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(TitledList);
