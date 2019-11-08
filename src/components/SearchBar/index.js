import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SearchBar from './SearchBar';
import styles from './styles';
import { fetchUnits } from '../../redux/actions/unit';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, units, settings, user,
  } = state;
  const { isFetching, previousSearch } = units;
  return {
    previousSearch,
    isFetching,
    navigator,
    settings,
    locale: user.locale,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { fetchUnits },
)(SearchBar)));
