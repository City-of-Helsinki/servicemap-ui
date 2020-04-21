import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getLocaleString } from '../../../../redux/selectors/locale';
import InfoList from './InfoList';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
  };
};

export default injectIntl(connect(
  mapStateToProps,
)(InfoList));
