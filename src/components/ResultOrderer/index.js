import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { setDirection, setOrder } from '../../redux/actions/sort';
import ResultOrderer from './ResultOrderer';

// Listen to redux state
const mapStateToProps = (state) => {
  const { direction, order } = state.sort;
  const { customPosition, position } = state.user;
  const coordinates = customPosition.coordinates || position.coordinates;

  return {
    direction,
    order,
    userLocation: coordinates,
  };
};

export default connect(mapStateToProps, { setDirection, setOrder })(
  injectIntl(ResultOrderer)
);
