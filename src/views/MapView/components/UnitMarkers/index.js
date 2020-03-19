import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import UnitMarkers from './UnitMarkers';
import { getLocaleString } from '../../../../redux/selectors/locale';
import styles from '../../styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, settings } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
    navigator,
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(UnitMarkers));
