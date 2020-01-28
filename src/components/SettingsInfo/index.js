import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { toggleSettings } from '../../redux/actions/settings';
import SettingsInfo from './SettingsInfo';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { toggleSettings },
)(SettingsInfo)));
