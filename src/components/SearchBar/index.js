import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import styles from './styles';
import fetchSearchResults from '../../redux/actions/search';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import SearchBarComponent from './SearchBarComponent';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, searchResults,
  } = state;
  const { isFetching, previousSearch } = searchResults;
  return {
    previousSearch,
    isFetching,
    navigator,
  };
};

export const SearchBar = withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit, fetchSearchResults },
)(SearchBarComponent));

export default SearchBar;
