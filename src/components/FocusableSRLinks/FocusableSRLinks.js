import React from 'react';
import PropTypes from 'prop-types';

const FocusableSRLinks = ({ classes, items }) => (
  <div className={classes.srFocusedContainer}>
    {
      items.map(v => (
        <a href={v.href} className={classes.srFocused}>
          {v.text}
        </a>
      ))
    }
  </div>
);

FocusableSRLinks.propTypes = {
  classes: PropTypes.shape({
    srFocusedContainer: PropTypes.string,
    srFocused: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.node.isRequired,
  })).isRequired,
};

export default FocusableSRLinks;
