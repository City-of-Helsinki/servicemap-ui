import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  getStatisticalDistrictSelectedCategory,
  getStatisticalDistrictSelection,
} from '../../../../redux/selectors/statisticalDistrict';
import { selectThemeMode } from '../../../../redux/selectors/user';
import dataVisualization from '../../../../utils/dataVisualization';
import ColorIndicator from './ColorIndicator';

function StatisticalDataMapInfoComponent() {
  const { proportionScales, section } = useSelector(
    getStatisticalDistrictSelection
  );
  const category = useSelector(getStatisticalDistrictSelectedCategory);
  const useContrast = useSelector(selectThemeMode) === 'dark';

  const proportionsExist =
    proportionScales.min >= 0 &&
    proportionScales.max &&
    proportionScales.average;

  if (!section) {
    return null;
  }

  return (
    <>
      <StyledTitle variant="body2">
        <FormattedMessage id={`area.list.statistic.${category}`} />
        {': '}
        <FormattedMessage id={`area.list.statistic.${section}`} />
      </StyledTitle>
      {proportionsExist && (
        <ColorIndicator
          gradientColor={
            useContrast
              ? dataVisualization.COLOR_CONTRAST
              : dataVisualization.COLOR
          }
          left={
            dataVisualization.isTotal(section)
              ? `${proportionScales.min}`
              : `${proportionScales.min.toFixed(0)}%`
          }
          middle={
            dataVisualization.isTotal(section)
              ? `${proportionScales.average.toFixed(0)}`
              : `${proportionScales.average.toFixed(0)}%`
          }
          right={
            dataVisualization.isTotal(section)
              ? `${proportionScales.max}`
              : `${proportionScales.max.toFixed(0)}%`
          }
        />
      )}
      {!dataVisualization.isTotal(section) && (
        <StyledBottomText component="p" variant="caption">
          <FormattedMessage
            id="area.statisticalDistrict.label.percent"
            values={{ percent: '' }}
          />
        </StyledBottomText>
      )}
    </>
  );
}

export default StatisticalDataMapInfoComponent;

const StyledTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  margin: theme.spacing(1.5, 0, 0.5, 0),
}));

const StyledBottomText = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 'normal',
  margin: theme.spacing(0.5, 1),
}));
