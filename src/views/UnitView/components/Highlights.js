import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Link } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
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
          {
              item.value.www
                ? (
                  <Link className={classes.link} href={getLocaleText(item.value.www)} target="_blank">
                    {getLocaleText(item.value.name)}
                    {' '}
                    <FormattedMessage id="unit.opens.new.tab" />
                  </Link>
                )
                : getLocaleText(item.value.name)
            }
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
