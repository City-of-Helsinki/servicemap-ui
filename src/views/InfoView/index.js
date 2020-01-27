import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { getLocaleString } from '../../redux/selectors/locale';
import InfoView from './InfoView';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { locale } = state.user;
  return {
    getLocaleText,
    navigator,
    locale,
  };
};

export default withStyles(styles)(withRouter(connect(
  mapStateToProps,
)(InfoView)));
