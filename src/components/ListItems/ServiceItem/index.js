import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import ServiceItem from './ServiceItem';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(ServiceItem));
