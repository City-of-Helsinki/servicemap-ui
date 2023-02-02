import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import {
  toggleHearingAid,
  setMobility,
  setMapType,
  toggleColorblind,
  toggleVisuallyImpaired,
  toggleCity,
  toggleSettings,
} from '../../redux/actions/settings';
import Settings from './Settings';
import styles from './styles';
import { changeTheme } from '../../redux/actions/user';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { settings } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    settings,
    getLocaleText,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  {
    toggleHearingAid,
    setMobility,
    setMapType,
    toggleColorblind,
    toggleVisuallyImpaired,
    toggleCity,
    toggleSettings,
    changeTheme,
  },
)(injectIntl(Settings)));
