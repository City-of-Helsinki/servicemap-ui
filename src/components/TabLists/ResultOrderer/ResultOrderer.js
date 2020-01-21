/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import {
  FormControl, Select, Typography,
} from '@material-ui/core';

const allowedDirections = [
  'asc',
  'desc',
];

const allowedOrders = [
  'match',
  'alphabetical',
  'accessibility',
  'distance',
];

class ResultOrderer extends React.Component {
  isValidDirection = direction => direction && allowedDirections.indexOf(direction) > -1;

  isValidOrder = order => order && allowedOrders.indexOf(order) > -1;

  handleChange = (event) => {
    const {
      setDirection, setOrder,
    } = this.props;
    const array = event.target.value.split('-');
    const direction = array[1];
    const order = array[0];

    if (this.isValidDirection(direction) && this.isValidOrder(order)) {
      setDirection(direction);
      setOrder(order);
    }
  };

  render() {
    const {
      classes, direction, intl, order, disabled, handleChange, userLocation,
    } = this.props;
    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Typography color="inherit" variant="caption" className={classes.inputLabel}>
            <FormattedMessage id="sorting.label" />
          </Typography>
          <Select
            disabled={disabled}
            className={classes.select}
            native
            value={`${order}-${direction}`}
            onChange={handleChange || this.handleChange}
            inputProps={{
              name: 'result-sorter',
              id: 'result-sorter',
              classes: {
                icon: classes.icon,
              },
              className: `${classes.input}`,
            }}
          >
            <option className={classes.black} value="match-desc">{intl.formatMessage({ id: 'sorting.match.desc' })}</option>
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
  }
}

ResultOrderer.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  direction: PropTypes.oneOf(allowedDirections).isRequired,
  intl: intlShape.isRequired,
  order: PropTypes.oneOf(allowedOrders).isRequired,
  setDirection: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

ResultOrderer.defaultProps = {
  disabled: false,
  handleChange: null,
  userLocation: null,
};

export default ResultOrderer;
