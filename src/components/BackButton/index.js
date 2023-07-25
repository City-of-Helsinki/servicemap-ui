import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import BackButton from './BackButton';

// Listen to redux state
const mapStateToProps = (state) => {
  const { breadcrumb, navigator } = state;
  return {
    breadcrumb,
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  null,
)(BackButton));
