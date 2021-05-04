import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Switch } from '@material-ui/core';

const DistrictToggleButton = ({
  district, onToggle, selected, selectionSize, label, classes, ...rest
}) => (
  <FormControlLabel
    onFocus={event => event.stopPropagation()}
    className={classes.areaSwitch}
    label={label && (
      <div className={classes.labelContainer}>
        {label}
      </div>
    )}
    control={(
      <Switch
        color="primary"
        classes={{ thumb: classes.switchBorder }}
        size="small"
        value={district.id}
        className={classes.customSwitch}
        inputProps={{
          role: 'button',
          'aria-setsize': selectionSize ? selectionSize.toString() : null,
          'aria-pressed': selected,
        }}
        onChange={e => onToggle(e)}
        aria-labelledby={`${`${district.id}Name`} ${`${district.id}Period`}`}
        checked={selected}
        {...rest}
      />
    )}
  />
);

DistrictToggleButton.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  onToggle: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  selected: PropTypes.bool,
  selectionSize: PropTypes.number,
  label: PropTypes.objectOf(PropTypes.any),
};

DistrictToggleButton.defaultProps = {
  selected: false,
  label: null,
  selectionSize: null,
};

export default DistrictToggleButton;