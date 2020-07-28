import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import styles from './styles';

const Loading = (props) => {
  const {
    children, classes, text, intl, progress, reducer,
  } = props;

  if (reducer) {
    const {
      count, data, isFetching, max,
    } = reducer;
    // Render loding text if currently loading information
    if (isFetching) {
      if (max) {
        const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;
        const text = intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max });
        return (
          <div className={classes.root}>
            <Typography variant="body2" aria-hidden="true">{text || <FormattedMessage id="general.fetching" />}</Typography>
            <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
          </div>
        );
      }
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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

Loading.defaultProps = {
  children: null,
  text: null,
  reducer: null,
  progress: null,
};
