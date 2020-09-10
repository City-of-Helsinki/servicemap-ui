import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ToolMenu from './ToolMenu';
import styles from './styles';
import { setMeasuringMode } from '../../redux/actions/map';

const mapStateToProps = (state) => {
  const { navigator, measuringMode } = state;
  return {
    navigator,
    measuringMode,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMeasuringMode },
)(withStyles(styles)(ToolMenu)));
