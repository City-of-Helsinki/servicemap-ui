import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import styles from '../styles/styles';
import unitSectionFilter from '../utils/unitSectionFilter';

const Highlights = ({ unit, classes, getLocaleText }) => (
  <div className={classes.marginVertical}>
    {unitSectionFilter(unit.connections, 'HIGHLIGHT').map(item => (
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

Highlights.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

export default withStyles(styles)(Highlights);
