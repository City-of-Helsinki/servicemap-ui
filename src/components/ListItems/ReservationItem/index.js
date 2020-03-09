import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ReservationItem from './ReservationItem';
import { getLocaleString } from '../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
  };
};

export default injectIntl(connect(mapStateToProps)(ReservationItem));
