import { connect } from 'react-redux';

import { setMeasuringMode } from '../../redux/actions/map';
import ToolMenu from './ToolMenu';

export default connect(() => ({}), { setMeasuringMode })(ToolMenu);
