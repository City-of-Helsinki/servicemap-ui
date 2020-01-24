import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DivisionView from './DivisionView';
import { fetchUnits } from '../../redux/actions/unit';
import setHighlightedDistrict from '../../redux/actions/district';
import getHighlightedDistrict from '../../redux/selectors/district';

const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const highlightedDistrict = getHighlightedDistrict(state);
  return {
    highlightedDistrict,
    map,
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    fetchUnits,
    setHighlightedDistrict,
  },
)(DivisionView));
