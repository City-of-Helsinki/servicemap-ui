import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ToolMenu from './ToolMenu';
import styles from './styles';
import MapUtility from '../../utils/mapUtility';

const mapStateToProps = (state) => {
  const { mapRef, navigator } = state;
  const map = mapRef && mapRef.leafletElement;

  return {
    mapUtility: map ? new MapUtility({ map }) : null,
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(ToolMenu)));
