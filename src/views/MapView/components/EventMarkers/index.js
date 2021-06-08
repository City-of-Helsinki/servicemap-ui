import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import EventMarkers from './EventMarkers';
import styles from '../../styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(EventMarkers));
