import { FormatListBulleted } from '@mui/icons-material';
import { styled, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Loading, SMAccordion } from '../../../../components';
import {
  addSelectedService,
  fetchServices,
  fetchStatisticalDistricts,
  fetchStatisticalDistrictServiceUnits,
  removeSelectedService,
  selectCategory,
  selectStatisticalDistrict,
} from '../../../../redux/actions/statisticalDistrict';
import {
  getStatisticalDistrictAreaSelections,
  getStatisticalDistrictCategories,
  getStatisticalDistrictSelectedCategory,
  getStatisticalDistrictSelectedServices,
  getStatisticalDistrictSelection,
  getStatisticalDistrictsIsFetching,
  getStatisticalDistrictUnits,
} from '../../../../redux/selectors/statisticalDistrict';
import DistrictToggleButton from '../DistrictToggleButton';
import StatisticalDistrictUnitList from '../StatisticalDistrictUnitList';
import {
  StyledCaptionText,
  StyledDistrictServiceListLevelFour,
  StyledListItem,
  StyledListNoPaddingLevelThree,
  StyledListNoPaddingLevelTwo,
  StyledUnitsAccordion,
} from '../styled/styled';
import StatisticalDistrictListContent from './StatisticalDistrictListContent';

function StatisticalDistrictListComponent() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { section } = useSelector(getStatisticalDistrictSelection);
  const layerCategories = useSelector(getStatisticalDistrictCategories);
  const layerCategoryKeys = Object.keys(layerCategories);
  const units = useSelector(getStatisticalDistrictUnits);
  const filteredSubdistrictUnitsLength = units?.length || 0;
  const selectedServices = useSelector(getStatisticalDistrictSelectedServices);
  const selectedAreas = useSelector(getStatisticalDistrictAreaSelections);
  const selectedCategory = useSelector(getStatisticalDistrictSelectedCategory);
  const isFetchingDistricts = useSelector(getStatisticalDistrictsIsFetching);

  useEffect(() => {
    dispatch(fetchStatisticalDistricts());
    dispatch(fetchServices());
    return () => {
      // Clean up selections by setting selected category to undefined
      dispatch(selectCategory(undefined));
    };
  }, []);

  const handleUnitCheckboxChange = useCallback(
    (event, id) => {
      if (event.target.checked) {
        if (typeof selectedServices[id] === 'undefined') {
          dispatch(fetchStatisticalDistrictServiceUnits(id));
        }
        dispatch(addSelectedService(id));
      } else {
        dispatch(removeSelectedService(id));
      }
    },
    [dispatch, selectedServices]
  );

  const handleAccordionToggle = (districtCategory, opening, forecast) => {
    if (opening) {
      dispatch(selectStatisticalDistrict(districtCategory, forecast));
    } else {
      dispatch(selectStatisticalDistrict(undefined));
    }
  };

  const handleCategoryAccoridonToggle = (category, opening) => {
    if (opening) {
      dispatch(selectCategory(category));
    } else {
      dispatch(selectCategory(undefined));
    }
  };

  const renderLayers = (category) => {
    let component = null;
    if (category?.layers) {
      const isForecast = category?.type === 'forecast';
      component = category.layers.map((layer) => {
        const selected = section === layer;
        const serviceTitle = formatMessage({
          id: 'area.statisticalDistrict.service.filter',
        });
        const disableServicesAccordion = !Object.keys(selectedAreas).some(
          (a) => selectedAreas[a]
        );
        return (
          <StyledListItem disableGutters key={layer} className={`${layer}`}>
            <StyledStatisticalLayerAccordion // Layers in top level category
              defaultOpen={false}
              onOpen={(e, open) =>
                handleAccordionToggle(layer, !open, isForecast)
              }
              isOpen={selected}
              elevated={selected}
              adornment={
                <DistrictToggleButton
                  selected={selected}
                  district={{ id: layer }}
                  onToggle={() =>
                    handleAccordionToggle(layer, section !== layer, isForecast)
                  }
                  aria-hidden
                  inputProps={{
                    tabIndex: '-1',
                  }}
                />
              }
              titleContent={
                <Typography id={`${layer}Name`} component="p">
                  <FormattedMessage id={`area.list.statistic.${layer}`} />
                </Typography>
              }
              collapseContent={
                <StyledDistrictServiceListLevelFour>
                  <Typography component="h3" style={visuallyHidden}>
                    <FormattedMessage id="area.tab.statisticalDistricts" />
                    <FormattedMessage
                      id={`area.list.statistic.${category.type}`}
                    />
                    {category.year}
                    <FormattedMessage id={`area.list.statistic.${layer}`} />
                  </Typography>
                  <StyledUnitsAccordion // Unit list accordion
                    defaultOpen={false}
                    disableUnmount
                    disabled={!!disableServicesAccordion}
                    adornment={<StyledFormatListBulleted />}
                    titleContent={
                      <StyledCaptionText variant="caption">
                        <FormattedMessage
                          id="area.geographicalServices.statistical_district"
                          values={{ length: filteredSubdistrictUnitsLength }}
                        />
                      </StyledCaptionText>
                    }
                    collapseContent={
                      <StatisticalDistrictUnitList
                        handleUnitCheckboxChange={handleUnitCheckboxChange}
                        selectedServices={selectedServices}
                        title={serviceTitle}
                      />
                    }
                  />
                  <StyledStatisticalUnitInfo component="p" variant="caption">
                    <FormattedMessage id="area.statisticalDistrict.info" />
                  </StyledStatisticalUnitInfo>
                  <StatisticalDistrictListContent shownLayer={layer} />
                </StyledDistrictServiceListLevelFour>
              }
            />
          </StyledListItem>
        );
      });
    }
    return component;
  };

  const renderLayerCategories = () => {
    if (layerCategoryKeys.length) {
      return (
        <StyledListNoPaddingLevelTwo>
          {layerCategoryKeys.map((key) => {
            const layerCategory = layerCategories[key];
            const selected = layerCategory.type === selectedCategory;
            const titleText = `${formatMessage({
              id: `area.list.statistic.${layerCategory.type}`,
            })} ${layerCategory.year}`;
            return (
              <StyledListItem
                divider
                disableGutters
                key={key}
                className={`${key}`}
              >
                <StyledStatisticalCategoryAccordion // Top level categories
                  defaultOpen={false}
                  disableUnmount
                  onOpen={(e, open) =>
                    handleCategoryAccoridonToggle(layerCategory.type, !open)
                  }
                  isOpen={selected}
                  disabled={!!isFetchingDistricts}
                  elevated={selected}
                  titleContent={
                    <Typography id={`${key}Name`}>{titleText}</Typography>
                  }
                  collapseContent={
                    <StyledListNoPaddingLevelThree>
                      {renderLayers(layerCategory)}
                    </StyledListNoPaddingLevelThree>
                  }
                />
              </StyledListItem>
            );
          })}
        </StyledListNoPaddingLevelTwo>
      );
    }
    return (
      <StyledNoDataTypography aria-live="polite" variant="body2">
        <FormattedMessage id="area.statisticalDistrict.noData" />
      </StyledNoDataTypography>
    );
  };

  return (
    <>
      {isFetchingDistricts ? (
        <StyledLoadingContainer>
          <Loading
            reducer={{
              isFetching: isFetchingDistricts,
            }}
          />
        </StyledLoadingContainer>
      ) : (
        renderLayerCategories()
      )}
    </>
  );
}

export default StatisticalDistrictListComponent;

const StyledLoadingContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const StyledNoDataTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
}));

const StyledStatisticalCategoryAccordion = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(9),
}));

const StyledStatisticalLayerAccordion = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(7),
}));

const StyledStatisticalUnitInfo = styled(Typography)(({ theme }) => ({
  backgroundColor: 'rgba(222, 222, 222, 0.56)',
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
  paddingLeft: theme.spacing(9),
  fontWeight: 'normal',
  color: 'black',
}));

const StyledFormatListBulleted = styled(FormatListBulleted)(({ theme }) => ({
  padding: theme.spacing(2.5),
  paddingLeft: theme.spacing(7),
}));
