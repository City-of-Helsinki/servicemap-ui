import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import HomeView from './HomeView';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;

  return {
    navigator,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(HomeView));
