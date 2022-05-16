import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import styles from '../../styles';
import AddressMarker from './AddressMarker';

// Listen to redux state
const mapStateToProps = (state) => {
  const { address } = state;
  return {
    address,
  };
};


export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(AddressMarker));
