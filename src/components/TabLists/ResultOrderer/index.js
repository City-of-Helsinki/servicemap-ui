import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { getOrderedData } from '../../../redux/selectors/results';
import ResultOrderer from './ResultOrderer';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const orderingFunction = (data, order, direction) => {
    const orderedData = getOrderedData(state, data, order, direction);
    return orderedData;
  };

  return {
    orderingFunction,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  null,
)(ResultOrderer));
