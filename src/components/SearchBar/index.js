import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SearchBar from './SearchBar';
import styles from './styles';
import fetchSearchResults from '../../redux/actions/search';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, units,
  } = state;
  const { isFetching, previousSearch } = units;
  return {
    previousSearch,
    isFetching,
    navigator,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { changeSelectedUnit, fetchSearchResults },
)(SearchBar)));
