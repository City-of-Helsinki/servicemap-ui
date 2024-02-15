import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';

const Loading = (props) => {
  const {
    children, hideNumbers, text, intl, progress, reducer,
  } = props;

  if (reducer) {
    const {
      count, data, isFetching, max,
    } = reducer;
    // Render loading text if currently loading information
    if (isFetching) {
      if (max) {
        const percentage = Math.floor(((count / max) * 100));
        const progress = count ? percentage : 0;
        const text = intl?.formatMessage({ id: 'search.loading.units' }, { percentage });
        return (
          <StyledDivRoot data-sm="LoadingIndicator">
            <Typography variant="body2" aria-hidden="true">{(!hideNumbers && text) || <FormattedMessage id="general.fetching" />}</Typography>
            <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
          </StyledDivRoot>
        );
      }
      return <StyledTypographyRoot><FormattedMessage id="general.loading" /></StyledTypographyRoot>;
    }
    // Check if data exists or if data is an array that it has results
    if (!data || (Array.isArray(data) && !data.length)) {
      return <StyledTypographyRoot><FormattedMessage id="general.noData" /></StyledTypographyRoot>;
    }
    return children;
  }

  return (
    <StyledDivRoot data-sm="LoadingIndicator">
      <Typography variant="body2" aria-hidden="true">{text || <FormattedMessage id="general.fetching" />}</Typography>
      <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
    </StyledDivRoot>
  );
};

const rootStyles = ({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: 2,
});

const StyledTypographyRoot = styled(Typography)(rootStyles);
const StyledDivRoot = styled('div')(rootStyles);

export default Loading;

// Typechecking
Loading.propTypes = {
  children: PropTypes.node,
  hideNumbers: PropTypes.bool,
  text: PropTypes.string,
  progress: PropTypes.number,
  reducer: PropTypes.shape({
    isFetching: PropTypes.bool,
    count: PropTypes.number,
    max: PropTypes.number,
    data: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.array,
    ]),
  }),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

Loading.defaultProps = {
  children: null,
  hideNumbers: false,
  text: null,
  reducer: null,
  progress: null,
};
