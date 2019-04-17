import React from 'react';
import PropTypes from 'prop-types';
import { Typography, LinearProgress } from '@material-ui/core';

const Loading = (props) => {
  const { text, progress } = props;
  return (
    <div>
      <Typography variant="body2" aria-hidden="true">{text}</Typography>
      <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
    </div>
  );
};

export default Loading;

// Typechecking
Loading.propTypes = {
  text: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};
