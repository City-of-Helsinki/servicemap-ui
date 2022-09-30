import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { getTheme } from '../../../../redux/selectors/user';
import dataVisualization from '../../../../utils/dataVisualization';
import ColorIndicator from './ColorIndicator';

const StatisticalDataMapInfoComponent = () => {
  const {
    proportionScales,
    section,
  } = useSelector(state => state.statisticalDistrict.districts.selection);
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
      <StyledText variant="body2">
        <FormattedMessage id={`area.list.statistic.${section}`} />
      </StyledText>
      {
        proportionsExist
        && (
          <ColorIndicator
            gradientColor={useContrast ? dataVisualization.COLOR_CONTRAST : dataVisualization.COLOR}
            left={dataVisualization.isTotal(section) ? proportionScales.min : `${proportionScales.min.toFixed(0)}%`}
            middle={dataVisualization.isTotal(section) ? proportionScales.average : `${proportionScales.average.toFixed(0)}%`}
            right={dataVisualization.isTotal(section) ? proportionScales.max : `${proportionScales.max.toFixed(0)}%`}
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
