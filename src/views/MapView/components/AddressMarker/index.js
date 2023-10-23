import { connect } from 'react-redux';
import AddressMarker from './AddressMarker';

// Listen to redux state
const mapStateToProps = (state) => {
  const { address } = state;
  return {
    address,
  };
};

export default connect(
  mapStateToProps,
  null,
)(AddressMarker);
