import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ToolMenu from './ToolMenu';
import styles from './styles';
import MapUtility from '../../utils/mapUtility';
import { setMeasuringMode } from '../../redux/actions/map';

const mapStateToProps = (state) => {
  const { mapRef, navigator, measuringMode } = state;
  const map = mapRef && mapRef.leafletElement;

  return {
    mapUtility: map ? new MapUtility({ map }) : null,
    navigator,
    measuringMode,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMeasuringMode },
)(withStyles(styles)(ToolMenu)));
