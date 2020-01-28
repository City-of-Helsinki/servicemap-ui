import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';

const SettingsInfoItem = ({
  ariaText,
  classes,
  divider,
  icon,
  text,
}) => (
  <div aria-label={ariaText} className={classes.infoItem}>
    <div>
      {icon}
      <Typography className={classes.infoItemText}>{text}</Typography>
    </div>
    {
      divider && <div aria-hidden="true" className={classes.verticalDivider} />
    }
  </div>
);

SettingsInfoItem.propTypes = {
  ariaText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  divider: PropTypes.bool,
  icon: PropTypes.node,
  text: PropTypes.node,
};

SettingsInfoItem.defaultProps = {
  ariaText: null,
  divider: false,
  icon: null,
  text: null,
};

export default SettingsInfoItem;
