import { connect } from 'react-redux';
import Reservations from './Reservations';

const mapStateToProps = (state) => {
  const { navigator, selectedUnit } = state;
  const unit = selectedUnit.unit.data;
  return {
    unit,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Reservations);
