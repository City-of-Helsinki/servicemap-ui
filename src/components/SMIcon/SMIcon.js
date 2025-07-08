import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

function SMIcon({ className = '', icon, ...rest }) {
  return (
    <StyledIcon
      aria-hidden="true"
      className={`${className} ${icon}`}
      {...rest}
    />
  );
}

const StyledIcon = styled('span')(({ theme }) => ({
  alignSelf: 'center',
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  fontSize: 24,
}));

SMIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default SMIcon;
