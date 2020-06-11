import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import styles from './styles';

const Loading = (props) => {
  const {
    children, classes, text, progress, reducer,
  } = props;

  if (reducer) {
    const { data, isFetching } = reducer;
    // Render loding text if currently loading information
    if (isFetching) {
      return <Typography className={classes.root}><FormattedMessage id="general.loading" /></Typography>;
    }
    // Check if data exists or if data is an array that it has results
    if (!data || (Array.isArray(data) && !data.length)) {
      return <Typography className={classes.root}><FormattedMessage id="general.noData" /></Typography>;
    }
    return children;
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2" aria-hidden="true">{text || <FormattedMessage id="general.fetching" />}</Typography>
      <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
    </div>
  );
};

export default withStyles(styles)(Loading);

// Typechecking
Loading.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.string,
  progress: PropTypes.number,
  reducer: PropTypes.shape({
    isFetching: PropTypes.bool,
    data: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.array,
    ]),
  }),
};

Loading.defaultProps = {
  children: null,
  text: null,
  reducer: null,
  progress: null,
};
