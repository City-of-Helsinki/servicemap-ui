import { connect } from 'react-redux';
import PaginatedList from './PaginatedList';

const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};
export default connect(mapStateToProps)(PaginatedList);
