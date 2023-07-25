import { connect } from 'react-redux';
import AddressItem from './AddressItem';

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const { navigator } = state;
  return {
    currentService: current,
    navigator,
  };
};

export default connect(mapStateToProps)(AddressItem);
