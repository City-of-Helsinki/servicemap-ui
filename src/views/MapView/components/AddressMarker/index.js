import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import styles from '../../styles';
import { getLocaleString } from '../../../../redux/selectors/locale';
import AddressMarker from './AddressMarker';

// Listen to redux state
const mapStateToProps = (state) => {
  const { address } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    address,
    getLocaleText,
  };
};


export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(AddressMarker));
