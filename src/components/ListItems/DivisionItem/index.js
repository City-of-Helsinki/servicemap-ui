import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DivisionItem from './DivisionItem';

const mapStateToProps = (state) => {
  const { navigator, user } = state;
  const { locale } = user;

  return {
    locale,
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(DivisionItem));
