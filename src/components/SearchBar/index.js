import { connect } from 'react-redux';
import SearchBar from './SearchBar';

// Listen to redux state
const mapStateToProps = (state) => {
  const { units } = state;
  const { previousSearch, filters } = units;
  return {
    filters,
    previousSearch,
  };
};
export default connect(
  mapStateToProps,
)(SearchBar);
