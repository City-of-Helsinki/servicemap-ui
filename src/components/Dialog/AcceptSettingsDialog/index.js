import { connect } from 'react-redux';
import AcceptSettingsDialogComponent from './AcceptSettingsDialogComponent';
import { activateSetting, resetAccessibilitySettings } from '../../../redux/actions/settings';

export const AcceptSettingsDialog = connect(
  null,
  {
    activateSetting,
    resetAccessibilitySettings,
  },
)(AcceptSettingsDialogComponent);

export default AcceptSettingsDialog;
