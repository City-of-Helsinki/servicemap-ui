import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setNavigatorRef } from '../../redux/actions/navigator';
import Navigator from './Navigator';

/**
 * Wrapper component for Navigator for saving ref to redux state and forwarding
 * history and match props to Navigator
 */
class NavigatorWrapper extends React.Component {
  saveNavigatorRef = (ref) => {
    const { setNavigatorRef } = this.props;
    setNavigatorRef(ref);
  };

  render() {
    const { history, location, match } = this.props;
    return (
      <Navigator
        history={history}
        location={location}
        match={match}
        ref={this.saveNavigatorRef}
      />
    );
  }
}

NavigatorWrapper.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  setNavigatorRef: PropTypes.func.isRequired,
};

export default withRouter(
  connect(null, {
    setNavigatorRef,
  })(NavigatorWrapper)
);
