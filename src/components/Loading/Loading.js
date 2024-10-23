import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from '@emotion/styled';
import config from '../../../config';

const Loading = (props) => {
  const {
    children = null,
    hideNumbers = false,
    text = null,
    progress = null,
    reducer = null,
  } = props;
  const intl = useIntl();
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // If necessary we create a timeout (a callback for timeout) that will switch flag to
    // display "we are still loading" message.
    const noOp = () => {};
    if (!reducer?.fetchStartTime) {
      return noOp;
    }
    if (!reducer?.isFetching) {
      setShowSlowMessage(false);
      return noOp;
    }
    const messageDisplayTimeStamp = reducer.fetchStartTime + config.slowFetchMessageTimeout;
    const msUntilSorryWeAreSlowMessage = messageDisplayTimeStamp - new Date().valueOf();
    if (msUntilSorryWeAreSlowMessage < 0) {
      setShowSlowMessage(true);
      return noOp;
    }
    const timeoutId = setTimeout(() => {
      setShowSlowMessage(true);
    }, msUntilSorryWeAreSlowMessage);
    return () => clearTimeout(timeoutId);
  }, [reducer?.fetchStartTime, reducer?.isFetching]);

  if (reducer) {
    const {
      count, data, isFetching, max,
    } = reducer;
    // Render loading text if currently loading information
    if (isFetching) {
      const fetchingTextKey = showSlowMessage ? 'general.fetchingTakesTime' : 'general.fetching';
      if (max) {
        const percentage = Math.floor(((count / max) * 100));
        const progress = count ? percentage : 0;
        const loadingUnitsKey = showSlowMessage ? 'general.fetchingTakesTime' : 'search.loading.units';
        const text = intl.formatMessage({ id: loadingUnitsKey }, { percentage });
        return (
          <StyledDivRoot data-sm="LoadingIndicator">
            <Typography variant="body2" aria-hidden="true">{(!hideNumbers && text) || <FormattedMessage id={fetchingTextKey} />}</Typography>
            <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
          </StyledDivRoot>
        );
      }
      return <StyledTypographyRoot><FormattedMessage id={fetchingTextKey} /></StyledTypographyRoot>;
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
    fetchStartTime: PropTypes.number,
    count: PropTypes.number,
    max: PropTypes.number,
    data: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.array,
    ]),
  }),
};
