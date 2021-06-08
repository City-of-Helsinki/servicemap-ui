import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import AccessibilityInfo from './AccessibilityInfo';
import styles from './styles';

const mapStateToProps = (state) => {
  const { selectedUnit, settings } = state;
  const { data } = selectedUnit.unit;
  const { accessibilitySentences } = selectedUnit;
  return {
    accessibilitySentences,
    unit: data,
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(AccessibilityInfo));
