import { connect } from 'react-redux';

import {
  setSelectedDistrictServices,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import Districts from './Districts';

export default connect(() => ({}), {
  setSelectedSubdistricts,
  setSelectedDistrictServices,
})(Districts);
