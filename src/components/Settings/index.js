import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import {
  toggleHearingAid,
  setMobility,
  setMapType,
  toggleColorblind,
  toggleVisuallyImpaired,
  toggleHelsinki,
  toggleEspoo,
  toggleVantaa,
  toggleKauniainen,
  toggleSettings,
} from '../../redux/actions/settings';
import Settings from './Settings';
import styles from './styles';
import { changeTheme } from '../../redux/actions/user';

const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
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
    toggleHelsinki,
    toggleEspoo,
    toggleVantaa,
    toggleKauniainen,
    toggleSettings,
    changeTheme,
  },
)(injectIntl(Settings)));
