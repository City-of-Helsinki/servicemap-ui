import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SearchBar from './SearchBar';
import styles from './styles';
import { fetchUnits } from '../../redux/actions/unit';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, units } = state;
  const { isFetching, previousSearch } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    previousSearch,
    isFetching,
    navigator,
    getLocaleText,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { fetchUnits },
)(SearchBar)));
