import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { fetchErrors, fetchNews } from '../redux/actions/alerts';
import DefaultLayout from './DefaultLayout';
import styles from './styles';

export default connect(
  () => ({}),
  { fetchErrors, fetchNews },
)(withStyles(styles)(DefaultLayout));
