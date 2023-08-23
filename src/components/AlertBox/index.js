import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AlertBox from './AlertBox';

// Listen to redux state
const mapStateToProps = (state) => {
  const { alerts } = state;
  const { errors } = alerts;

  return {
    errors: errors.data || [],
  };
};

export default injectIntl(connect(mapStateToProps)(AlertBox));
