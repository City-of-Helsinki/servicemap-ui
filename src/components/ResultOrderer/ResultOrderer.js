/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  FormControl, Select, Typography,
} from '@mui/material';
import { useAcccessibilitySettings } from '../../utils/settings';

const allowedDirections = [
  'asc',
  'desc',
];

const allowedOrders = [
  // 'match',
  'alphabetical',
  'accessibility',
  'distance',
];

const allowedInitialValues = [
  // 'match-desc',
  'alphabetical-desc',
  'alphabetical-asc',
  'accessibility-desc',
  'distance-asc',
];

const ResultOrderer = ({
  classes,
  initialOrder,
  direction,
  intl,
  order,
  disabled,
  setDirection,
  setOrder,
  userLocation,
}) => {
  const accessibiliySettingsLength = useAcccessibilitySettings().length;

  const isValidDirection = direction => direction && allowedDirections.indexOf(direction) > -1;

  const isValidOrder = order => order && allowedOrders.indexOf(order) > -1;

  const defaultHandleChange = (event) => {
    const array = event.target.value.split('-');
    const direction = array[1];
    const order = array[0];

    if (isValidDirection(direction) && isValidOrder(order)) {
      setDirection(direction);
      setOrder(order);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      const parts = initialOrder.split('-');
      const direction = parts[1];
      const order = parts[0];

      if (isValidDirection(direction) && isValidOrder(order)) {
        setDirection(direction);
        setOrder(order);
      }
    }
  }, []);

  useEffect(() => {
    if (accessibiliySettingsLength) {
      setOrder('accessibility');
    }
  }, [accessibiliySettingsLength]);

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <Typography color="inherit" variant="caption" component="label" for="result-sorter" className={classes.inputLabel}>
          <FormattedMessage id="sorting.label" />
        </Typography>
        <Select
          disabled={disabled}
          className={classes.select}
          native
          variant="standard"
          value={`${order}-${direction}`}
          onChange={defaultHandleChange}
          classes={{ select: classes.selectElement }}
          inputProps={{
            name: 'result-sorter',
            id: 'result-sorter',
            classes: {
              icon: classes.icon,
            },
            className: `${classes.input}`,
          }}
        >
          {/* <option className={classes.black} value="match-desc">{intl.formatMessage({ id: 'sorting.match.desc' })}</option> */}
          <option className={classes.black} value="alphabetical-desc">{intl.formatMessage({ id: 'sorting.alphabetical.desc' })}</option>
          <option className={classes.black} value="alphabetical-asc">{intl.formatMessage({ id: 'sorting.alphabetical.asc' })}</option>
          <option className={classes.black} value="accessibility-desc">{intl.formatMessage({ id: 'sorting.accessibility.desc' })}</option>
          {
            userLocation
            && (
              <option className={classes.black} value="distance-asc">{intl.formatMessage({ id: 'sorting.distance.asc' })}</option>
            )
          }
        </Select>
      </FormControl>
    </form>
  );
};

ResultOrderer.propTypes = {
  initialOrder: PropTypes.oneOf(allowedInitialValues),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  direction: PropTypes.oneOf(allowedDirections).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  order: PropTypes.oneOf(allowedOrders).isRequired,
  setDirection: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

ResultOrderer.defaultProps = {
  initialOrder: null,
  disabled: false,
  userLocation: null,
};

export default ResultOrderer;
