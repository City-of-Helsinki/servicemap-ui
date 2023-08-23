import { connect } from 'react-redux';
import ServiceItem from './ServiceItem';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default connect(mapStateToProps)(ServiceItem);
