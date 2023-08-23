import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import setTreeState from '../../redux/actions/serviceTree';
import ServiceTreeView from './ServiceTreeView';

const mapStateToProps = (state) => {
  const { navigator, serviceTree, settings } = state;
  return {
    navigator,
    prevServices: (serviceTree && serviceTree.services) || [],
    prevSelected: (serviceTree && serviceTree.selected) || [],
    prevOpened: (serviceTree && serviceTree.opened) || [],
    settings,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setTreeState },
)(ServiceTreeView));
