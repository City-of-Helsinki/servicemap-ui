import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { setNavigatorRef } from '../../redux/actions/navigator';
import Navigator from './Navigator';

/**
 * Wrapper component for Navigator for saving ref to redux state
 */
const NavigatorWrapper = ({ setNavigatorRef }) => {
  const saveNavigatorRef = useCallback(
    (ref) => {
      setNavigatorRef(ref);
    },
    [setNavigatorRef]
  );

  return <Navigator ref={saveNavigatorRef} />;
};

NavigatorWrapper.propTypes = {
  setNavigatorRef: PropTypes.func.isRequired,
};

export default connect(null, {
  setNavigatorRef,
})(NavigatorWrapper);
