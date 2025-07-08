import PropTypes from 'prop-types';
import React from 'react';

import { StyledDiv, StyledLink } from './styles';

function FocusableSRLinks({ items }) {
  return (
    <StyledDiv>
      {items.map((v) => (
        <StyledLink href={v.href} key={v.href}>
          {v.text}
        </StyledLink>
      ))}
    </StyledDiv>
  );
}

FocusableSRLinks.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default FocusableSRLinks;
