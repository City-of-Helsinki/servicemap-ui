import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import {
  toggleHearingAid,
  setMobility,
  toggleColorblind,
  toggleVisuallyImpaired,
  toggleHelsinki,
  toggleEspoo,
  toggleVantaa,
  toggleKauniainen,
} from '../../redux/actions/settings';
import Settings from './Settings';
import styles from './styles';

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
    toggleColorblind,
    toggleVisuallyImpaired,
    toggleHelsinki,
    toggleEspoo,
    toggleVantaa,
    toggleKauniainen,
  },
)(injectIntl(Settings)));
