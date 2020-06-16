import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import AddressSearchBar from './AddressSearchBar';
import styles from '../../styles';
import { getLocaleString } from '../../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { locale } = state.user;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    locale,
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
)(AddressSearchBar)));
