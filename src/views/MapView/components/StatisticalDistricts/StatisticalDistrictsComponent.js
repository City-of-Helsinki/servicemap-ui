import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  getStatisticalDistrictAreaSelections,
  getSelectedStatisticalDistricts,
  getStatisticalDistrictSelection,
  getStatisticalDistrictSelectedCategory,
} from '../../../../redux/selectors/statisticalDistrict';
import { getPage, selectThemeMode } from '../../../../redux/selectors/user';
import dataVisualization from '../../../../utils/dataVisualization';
import useLocaleText from '../../../../utils/useLocaleText';
import swapCoordinates from '../../utils/swapCoordinates';


const StatisticalDistrictsComponent = () => {
  const {
    Polygon,
    Tooltip,
  } = global.rL;

  const data = useSelector(getSelectedStatisticalDistricts);
  const selections = useSelector(getStatisticalDistrictAreaSelections);
  const { section } = useSelector(getStatisticalDistrictSelection);
  const page = useSelector(getPage);
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const location = useLocation();

  const hasSelections = Object.keys(selections).some(key => selections[key]);
  const sortedData = hasSelections ? data.filter(d => selections[d.id]) : data;
  const searchParams = new URLSearchParams(location.search);

  if (
    page !== 'area'
    || searchParams.get('t') !== '2'
    || typeof section === 'undefined'
  ) {
    return null;
  }

  return sortedData.map((district) => {
    const selected = selections[`${district.id}`];
    const fillColor = useContrast ? dataVisualization.COLOR_CONTRAST : dataVisualization.COLOR;
    const borderColor = fillColor;
    const area = district.boundary.coordinates.map(
      coords => swapCoordinates(coords),
    );
    const styles = selected ? {
      zIndex: 1000,
    } : {};
    return (
      <Polygon
        interactive
        key={district.id}
        positions={[[area]]}
        dashArray={null}
        dashOffset={selected ? '40' : '20'}
        pathOptions={{
          fillOpacity: district.selectedScaleAdjustedProportion,
          fillColor,
          color: borderColor,
          weight: 3,
        }}
        eventHandlers={{}}
        style={styles}
      >
        <Tooltip
          sticky
          direction="top"
          autoPan={false}
        >
          <StatisticalDistrictTooltip
            district={district}
          />
        </Tooltip>
      </Polygon>
    );
  });
};

export default StatisticalDistrictsComponent;


const StatisticalDistrictTooltip = ({
  district,
}) => {
  const { section } = useSelector(getStatisticalDistrictSelection);
  const getLocaleText = useLocaleText();
  const { formatMessage } = useIntl();
  const category = useSelector(getStatisticalDistrictSelectedCategory);
  const isTotal = section === 'ALL';
  const hasValue = typeof district?.selectedValue === 'number';
  const values = {
    count: district.selectedValue,
    percent: dataVisualization.isTotal(section)
      ? district.selectedProportion
      : (district.selectedProportion).toFixed(2),
  };
  const countText = formatMessage(
    { id: `area.statisticalDistrict.label.${hasValue ? 'people' : 'noResults'}` },
    values,
  );
  const percentText = formatMessage(
    { id: 'area.statisticalDistrict.label.percent' },
    values,
  );
  const categoryText = formatMessage({ id: `area.list.statistic.${category}` });
  const sectionText = formatMessage({ id: `area.list.statistic.${section}` });
  const currentSectionText = formatMessage(
    { id: 'area.statisticalDistrict.section' },
    { text: `${categoryText}, ${sectionText}` },
  );
  return (
    <StyledContainer>
      <StyledTitle variant="body1">
        {getLocaleText(district.name)}
      </StyledTitle>
      <StyledText variant="body2">
        {countText}
      </StyledText>
      {
        (!isTotal && hasValue)
        && (
          <StyledText variant="body2">
            {percentText}
          </StyledText>
        )
      }
      <StyledCurrentSelectionText variant="body2">
        {currentSectionText}
      </StyledCurrentSelectionText>
    </StyledContainer>
  );
};

StatisticalDistrictTooltip.propTypes = {
  district: PropTypes.shape({
    selectedValue: PropTypes.number,
    selectedProportion: PropTypes.number,
    selectedScaleAdjustedProportion: PropTypes.number,
    name: PropTypes.shape({
      fi: PropTypes.string,
      en: PropTypes.string,
      sv: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled(Typography)`
  font-weight: bold;
  text-align: left;
`;

const StyledText = styled(Typography)`
  text-align: left;
`;

const StyledCurrentSelectionText = styled(Typography)`
  text-align: left;
  font-size: 0.875rem;
  font-weight: 400;
  color: #4C4D4F;
`;
