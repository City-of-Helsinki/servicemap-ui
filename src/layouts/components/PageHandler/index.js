import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setCurrentPage } from '../../../redux/actions/user';
import { getLocaleString } from '../../../redux/selectors/locale';
import PageHandler from './PageHandler';

const mapStateToProps = (state) => {
  const { selectedUnit, service, event } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit: selectedUnit.unit.data,
    service: service.current,
    event,
    getLocaleText,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setCurrentPage },
)(PageHandler));
