import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import loadable from '@loadable/component';
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
} from '../../redux/actions/settings';
import styles from './styles';
import { changeTheme } from '../../redux/actions/user';

const Settings = loadable(() => import(/* webpackChunkName: "components" */'./Settings'));

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
    changeTheme,
  },
)(injectIntl(Settings)));
