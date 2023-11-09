import { connect } from 'react-redux';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import UnitItem from './UnitItem';

// Listen to redux state
const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem);
