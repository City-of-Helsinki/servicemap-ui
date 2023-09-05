import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import setTreeState from '../../redux/actions/serviceTree';
import ServiceTreeView from './ServiceTreeView';

const mapStateToProps = () => ({});

export default injectIntl(connect(
  mapStateToProps,
  { setTreeState },
)(ServiceTreeView));
