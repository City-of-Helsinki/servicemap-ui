import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Link = ({
  children,
  className,
  onClick,
}) => (
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

Link.defaultProps = {
  className: null,
};

export default Link;
