import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const HeadModifier = ({ children }) => (
  <Helmet>
    {children}
  </Helmet>
);

HeadModifier.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HeadModifier;
