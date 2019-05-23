import { connect } from 'react-redux';
import TabLists from './TabLists';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default connect(mapStateToProps)(TabLists);
