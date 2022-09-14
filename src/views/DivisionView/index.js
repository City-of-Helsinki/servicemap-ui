import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetchSearchResults from '../../redux/actions/search';
import DivisionView from './DivisionView';
import { setHighlightedDistrict } from '../../redux/actions/district';
import { getHighlightedDistrict } from '../../redux/selectors/district';

const mapStateToProps = (state) => {
  const { mapRef } = state;
  const map = mapRef;
  const highlightedDistrict = getHighlightedDistrict(state);
  return {
    highlightedDistrict,
    map,
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    fetchSearchResults,
    setHighlightedDistrict,
  },
)(DivisionView));
