import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../../redux/selectors/locale';
import { setNewCurrentService } from '../../../redux/actions/services';
import ServiceItem from './ServiceItem';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    currentService: current,
    getLocaleText,
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  { setNewCurrentService },
)(ServiceItem));
