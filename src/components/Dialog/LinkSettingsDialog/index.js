import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles';
import {
  activateSetting,
  resetAccessibilitySettings,
} from '../../../redux/actions/settings';
import LinkSettingsDialogComponent from './LinkSettingsDialogComponent';

export const LinkSettingsDialog = withStyles(styles)(connect(
  null,
  {
    activateSetting,
    resetAccessibilitySettings,
  },
)(LinkSettingsDialogComponent));

export default LinkSettingsDialog;
