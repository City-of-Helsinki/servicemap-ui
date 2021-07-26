import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import HomeView from './HomeView';
import { toggleSettings } from '../../redux/actions/settings';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { user, navigator } = state;
  return {
    unit: state.unit,
    navigator,
    userLocation: user.position,
  };
};

export default connect(
  mapStateToProps,
  { toggleSettings },
)(withStyles(styles)(HomeView));
