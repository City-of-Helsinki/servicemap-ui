import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import AddressItem from './AddressItem';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const { navigator } = state;
  return {
    currentService: current,
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(AddressItem));
