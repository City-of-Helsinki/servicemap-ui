import { connect } from 'react-redux';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';
import Events from './Events';

const mapStateToProps = (state) => {
  const unit = state.selectedUnit.unit.data;
  const { navigator } = state;
  return {
    unit,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnitEvents },
)(Events);
