import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import HomeView from './HomeView';
import { fetchUnits } from '../../redux/actions/unit';
import { toggleSettings } from '../../redux/actions/settings';
import styles from './styles';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const { units, user, navigator } = state;
  const {
    data, isFetching, count, max,
  } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit: state.unit,
    units: data,
    getLocaleText,
    isFetching,
    count,
    max,
    navigator,
    userLocation: user.position.coordinates,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits, toggleSettings },
)(withStyles(styles)(HomeView));
