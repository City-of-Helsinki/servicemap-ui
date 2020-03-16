import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import loadable from '@loadable/component';
import styles from './styles';
import { fetchUnits } from '../../redux/actions/unit';

const SearchBar = loadable(() => import(/* webpackChunkName: "components" */'./SearchBar'));

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
  { fetchUnits },
)(SearchBar)));
