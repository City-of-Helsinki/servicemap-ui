import { connect } from 'react-redux';

import {
  activateSetting,
  resetAccessibilitySettings,
} from '../../../redux/actions/settings';
import LinkSettingsDialogComponent from './LinkSettingsDialogComponent';

export const LinkSettingsDialog = connect(null, {
  activateSetting,
  resetAccessibilitySettings,
})(LinkSettingsDialogComponent);

export default LinkSettingsDialog;
