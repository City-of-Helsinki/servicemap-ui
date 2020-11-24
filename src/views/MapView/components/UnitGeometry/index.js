import { connect } from 'react-redux';
import UnitGeometry from './UnitGeometry';

const mapStateToProps = (state) => {
  const {
    navigator, user,
  } = state;
  const {
    page,
  } = user;
  return {
    currentPage: page,
    navigator,
  };
};

export default connect(mapStateToProps)(UnitGeometry);
