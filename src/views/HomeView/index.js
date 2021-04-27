import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import HomeView from './HomeView';
import { toggleSettings } from '../../redux/actions/settings';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { units, user, navigator } = state;
  const {
    data, isFetching, count, max,
  } = units;

  return {
    unit: state.unit,
    units: data,
    isFetching,
    count,
    max,
    navigator,
    userLocation: user.position,
  };
};

export default connect(
  mapStateToProps,
  { toggleSettings },
)(withStyles(styles)(HomeView));
