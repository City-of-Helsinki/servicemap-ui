import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import styles from '../styles/styles';
import unitSectionFilter from '../utils/unitSectionFilter';

const Highlights = ({ unit, classes, getLocaleText }) => {
  const connections = unitSectionFilter(unit.connections, 'HIGHLIGHT');

  if (!connections || !connections.length) {
    return null;
  }

  return (
    <div className={classes.marginVertical}>
      {connections.map(item => (
        <Typography
          key={item.id}
          className={`${classes.left} ${classes.paragraph}`}
          variant="body1"
        >
          {getLocaleText(item.value.name)}
        </Typography>
      ))}
    </div>
  );
};

Highlights.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

export default withStyles(styles)(Highlights);
