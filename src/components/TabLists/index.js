import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import TabLists from './TabLists';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const { customPosition, position } = state.user;
  return {
    navigator,
    userAddress: position.addressData || customPosition.addressData,
  };
};

export default connect(
  mapStateToProps,
)(injectIntl(withRouter(TabLists)));
