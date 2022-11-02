import React from 'react';
import PropTypes from 'prop-types';
import { SMSwitch } from '../../../../components';

const DistrictToggleButton = ({
  district, onToggle, selected, selectionSize, label, classes, inputProps, ...rest
}) => (
  <div id={district.id} className={classes.areaSwitch}>
    <SMSwitch
      color="primary"
      classes={{ thumb: classes.switchBorder }}
      size="small"
      value={district.id}
      className={classes.customSwitch}
      inputProps={{
        ...inputProps,
        role: 'button',
        'aria-setsize': selectionSize ? selectionSize.toString() : null,
        'aria-pressed': selected,
        'aria-labelledby': `${`${district.id}Name`} ${`${district.id}Period`}`,
      }}
      onChange={e => onToggle(e)}
      checked={selected}
      {...rest}
    />
    <div className={classes.labelContainer}>
      {label}
    </div>
  </div>
);

DistrictToggleButton.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  onToggle: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  selected: PropTypes.bool,
  selectionSize: PropTypes.number,
  inputProps: PropTypes.shape({
    tabindex: PropTypes.string,
  }),
  label: PropTypes.objectOf(PropTypes.any),
};

DistrictToggleButton.defaultProps = {
  selected: false,
  inputProps: {},
  label: null,
  selectionSize: null,
};

export default DistrictToggleButton;
