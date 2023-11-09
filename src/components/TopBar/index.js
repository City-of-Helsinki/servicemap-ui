import { connect } from 'react-redux';
import TopBar from './TopBar';
import { setMapType } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';

// Listen to redux state
const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  { changeTheme, setMapType },
)(TopBar);
