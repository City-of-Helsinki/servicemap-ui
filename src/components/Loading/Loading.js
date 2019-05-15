import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress, withStyles } from '@material-ui/core';
import styles from './styles';

const Loading = (props) => {
  const { classes, text, progress } = props;
  return (
    <div className={classes.root}>
      <Typography variant="body2" aria-hidden="true">{text}</Typography>
      <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
    </div>
  );
};

export default withStyles(styles)(Loading);

// Typechecking
Loading.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};
