import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import PrintView from './PrintView';
import styles from './styles';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { mapRef } = state;
  const map = mapRef?.leafletElement;
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    getLocaleText,
    map,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(PrintView));
