import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import HomeView from './HomeView';
import { fetchUnits } from '../../redux/actions/unit';
import { setCurrentPage } from '../../redux/actions/user';
import { toggleSettings } from '../../redux/actions/settings';
import styles from './styles';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const { units, navigator } = state;
  const {
    data, isFetching, count, max,
  } = units;
  return {
    unit: state.unit,
    units: data,
    isFetching,
    count,
    max,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits, setCurrentPage, toggleSettings },
)(withStyles(styles)(HomeView));
