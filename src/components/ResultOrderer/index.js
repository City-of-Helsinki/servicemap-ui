import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setDirection, setOrder } from '../../redux/actions/sort';
import ResultOrderer from './ResultOrderer';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { direction, order } = state.sort;
  const { customPosition, position } = state.user;
  const coordinates = customPosition.coordinates || position.coordinates;

  return {
    direction,
    order,
    userLocation: coordinates,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  { setDirection, setOrder },
)(injectIntl(ResultOrderer)));
