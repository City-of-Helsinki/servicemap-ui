import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import RouterPrompt from './RouterPrompt';

const ClientOnlyRouterPrompt = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  return <RouterPrompt {...props} />;
};

ClientOnlyRouterPrompt.propTypes = {
  when: PropTypes.bool.isRequired,
  onOK: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ClientOnlyRouterPrompt;
