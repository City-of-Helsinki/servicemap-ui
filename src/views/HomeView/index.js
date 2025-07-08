import { connect } from 'react-redux';

import HomeView from './HomeView';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;

  return {
    navigator,
  };
};

export default connect(mapStateToProps)(HomeView);
