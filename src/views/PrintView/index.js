import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import PrintView from './PrintView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { mapRef } = state;
  const map = mapRef;

  return {
    map,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(PrintView));
