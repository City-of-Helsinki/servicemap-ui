import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import AddressSearchBar from './AddressSearchBar';
import styles from '../../styles';

const mapStateToProps = (state) => {
  const { locale } = state.user;
  return {
    locale,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
)(AddressSearchBar)));
