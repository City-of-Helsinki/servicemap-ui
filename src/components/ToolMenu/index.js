import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ToolMenu from './ToolMenu';
import MapUtility from '../../utils/mapUtility';
import { setMeasuringMode } from '../../redux/actions/map';

const mapStateToProps = (state) => {
  const {
    mapRef, navigator, measuringMode, user,
  } = state;
  const map = mapRef;

  return {
    mapUtility: map ? new MapUtility({ map }) : null,
    navigator,
    measuringMode,
    currentPage: user.page,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMeasuringMode },
)(ToolMenu));
