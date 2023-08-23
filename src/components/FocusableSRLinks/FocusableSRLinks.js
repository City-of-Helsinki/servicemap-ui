import React from 'react';
import PropTypes from 'prop-types';
import { StyledDiv, StyledLink } from './styles';

const FocusableSRLinks = ({ items }) => (
  <StyledDiv>
    {
      items.map(v => (
        <StyledLink href={v.href} key={v.href}>
          {v.text}
        </StyledLink>
      ))
    }
  </StyledDiv>
);

FocusableSRLinks.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.node.isRequired,
  })).isRequired,
};

export default FocusableSRLinks;
