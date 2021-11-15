import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import styles from './styles';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import SearchBarComponent from './SearchBarComponent';

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

export const SearchBar = withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit, fetchUnits },
)(SearchBarComponent));

export default SearchBar;
