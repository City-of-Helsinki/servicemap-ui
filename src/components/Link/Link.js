import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

function Link({ children, className = null, onClick }) {
  return (
    <StyledLink
      className={`${className || ''} link`}
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
    >
      {children}
    </StyledLink>
  );
}

const StyledLink = styled('span')(() => ({
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': {
    cursor: 'pointer',
  },
}));

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Link;
