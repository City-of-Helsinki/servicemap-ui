import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setCurrentPage } from '../../../redux/actions/user';
import PageHandler from './PageHandler';

const mapStateToProps = (state) => {
  const { selectedUnit, service, event } = state;
  return {
    unit: selectedUnit.unit.data,
    service: service.current,
    event,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setCurrentPage },
)(PageHandler));
