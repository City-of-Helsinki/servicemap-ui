import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import AccessibilityInfo from './AccessibilityInfo';
import { getLocaleString } from '../../../../redux/selectors/locale';
import styles from './styles';

const mapStateToProps = (state) => {
  const { selectedUnit, settings } = state;
  const { data } = selectedUnit;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
    unit: data,
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(AccessibilityInfo));
