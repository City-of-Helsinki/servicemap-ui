import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles';
import AcceptSettingsDialogComponent from './AcceptSettingsDialogComponent';
import {
  activateSetting,
  resetAccessibilitySettings,
} from '../../../redux/actions/settings';

export const AcceptSettingsDialog = withStyles(styles)(connect(
  null,
  {
    activateSetting,
    resetAccessibilitySettings,
  },
)(AcceptSettingsDialogComponent));

export default AcceptSettingsDialog;
