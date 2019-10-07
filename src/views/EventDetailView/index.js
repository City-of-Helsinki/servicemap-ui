import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import EventDetailView from './EventDetailView';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    getLocaleText,
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(EventDetailView));
