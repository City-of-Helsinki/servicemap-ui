import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Districts from './Districts';
import styles from '../../styles';

const mapStateToProps = state => ({
  theme: state.user.theme,
});

export default withStyles(styles)(connect(mapStateToProps)(Districts));
