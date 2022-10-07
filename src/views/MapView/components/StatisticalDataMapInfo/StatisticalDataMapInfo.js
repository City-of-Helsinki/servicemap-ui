import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { getTheme } from '../../../../redux/selectors/user';
import dataVisualization from '../../../../utils/dataVisualization';
import ColorIndicator from './ColorIndicator';
import { getStatisticalDistrictSelectedCategory, getStatisticalDistrictSelection } from '../../../../redux/selectors/statisticalDistrict';

const StatisticalDataMapInfoComponent = () => {
  const {
    proportionScales,
    section,
  } = useSelector(getStatisticalDistrictSelection);
  const category = useSelector(getStatisticalDistrictSelectedCategory);
  const theme = useSelector(getTheme);
  const useContrast = theme === 'dark';

  const proportionsExist = proportionScales.min >= 0
    && proportionScales.max
    && proportionScales.average;

  if (!section) {
    return null;
  }

  return (
    <StyledContainer aria-hidden>
      <StyledTitle variant="body1">
        <FormattedMessage id={`area.list.statistic.${category}`} />
      </StyledTitle>
      <StyledText variant="body2">
        <FormattedMessage id={`area.list.statistic.${section}`} />
      </StyledText>
      {
        proportionsExist
        && (
          <ColorIndicator
            gradientColor={useContrast ? dataVisualization.COLOR_CONTRAST : dataVisualization.COLOR}
            left={dataVisualization.isTotal(section) ? `${proportionScales.min}` : `${proportionScales.min.toFixed(0)}%`}
            middle={dataVisualization.isTotal(section) ? `${proportionScales.average.toFixed(0)}` : `${proportionScales.average.toFixed(0)}%`}
            right={dataVisualization.isTotal(section) ? `${proportionScales.max}` : `${proportionScales.max.toFixed(0)}%`}
          />
        )
      }
    </StyledContainer>
  );
};

export default StatisticalDataMapInfoComponent;

const StyledContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

const StyledText = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  marginLeft: theme.spacing(0.5),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'left',
  marginLeft: theme.spacing(0.5),
}));
