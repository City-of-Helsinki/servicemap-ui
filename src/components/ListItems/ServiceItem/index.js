import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { setNewCurrentService } from '../../../redux/actions/services';
import ServiceItem from './ServiceItem';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const { navigator } = state;
  return {
    currentService: current,
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  { setNewCurrentService },
)(ServiceItem));
