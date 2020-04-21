import { connect } from 'react-redux';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';
import { getLocaleString } from '../../../../redux/selectors/locale';
import Events from './Events';

const mapStateToProps = (state) => {
  const unit = state.selectedUnit.unit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    unit,
    getLocaleText,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnitEvents },
)(Events);
