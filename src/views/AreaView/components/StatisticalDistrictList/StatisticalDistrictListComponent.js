import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FormatListBulleted } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  List,
  ListItem,
  styled,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Loading, SMAccordion } from '../../../../components';
import DistrictToggleButton from '../DistrictToggleButton';
import {
  getStatisticalDistrictAreaSelections,
  getStatisticalDistrictSelectedServices,
  getStatisticalDistrictSelection,
  getStatisticalDistrictUnits,
  getStatisticalDistrictSelectedCategory,
  getStatisticalDistrictsIsFetching,
  getStatisticalDistrictCategories,
} from '../../../../redux/selectors/statisticalDistrict';
import {
  addSelectedService,
  fetchServices,
  fetchStatisticalDistrictServiceUnits,
  fetchStatisticalDistricts,
  removeSelectedService,
  selectStatisticalDistrict,
  selectCategory,
} from '../../../../redux/actions/statisticalDistrict';
import StatisticalDistrictUnitList from '../StatisticalDistrictUnitList';
import StatisticalDistrictListContent from './StatisticalDistrictListContent';


const StatisticalDistrictListComponent = ({
  classes,
}) => {
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

  const handleUnitCheckboxChange = useCallback((event, id) => {
    if (event.target.checked) {
      if (typeof selectedServices[id] === 'undefined') {
        dispatch(fetchStatisticalDistrictServiceUnits(id));
      }
      dispatch(addSelectedService(id));
    } else {
      dispatch(removeSelectedService(id));
    }
  }, [dispatch, selectedServices]);

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
      component = (
        category.layers.map((layer) => {
          const selected = section === layer;
          const serviceTitle = formatMessage({ id: 'area.statisticalDistrict.service.filter' });
          const disableServicesAccordion = !Object.keys(selectedAreas).some(a => selectedAreas[a]);
          return (
            <ListItem
              disableGutters
              key={layer}
              className={`${classes.listItem} ${layer}`}
            >
              <SMAccordion // Layers in top level category
                className={classes.statisticalLayerAccordion}
                defaultOpen={false}
                onOpen={(e, open) => handleAccordionToggle(layer, !open, isForecast)}
                isOpen={selected}
                elevated={selected}
                adornment={(
                  <DistrictToggleButton
                    selected={selected}
                    district={{ id: layer }}
                    onToggle={() => handleAccordionToggle(layer, section !== layer, isForecast)}
                    aria-hidden
                    inputProps={{
                      tabIndex: '-1',
                    }}
                  />
                )}
                titleContent={(
                  <Typography id={`${layer}Name`} component="p">
                    <FormattedMessage id={`area.list.statistic.${layer}`} />
                  </Typography>
                )}
                collapseContent={(
                  <div className={`${classes.districtServiceList} ${classes.listLevelFour}`}>
                    <Typography component="h3" style={visuallyHidden}>
                      <FormattedMessage id="area.tab.statisticalDistricts" />
                      <FormattedMessage id={`area.list.statistic.${category.type}`} />
                      {category.year}
                      <FormattedMessage id={`area.list.statistic.${layer}`} />
                    </Typography>
                    <SMAccordion // Unit list accordion
                      defaultOpen={false}
                      disableUnmount
                      disabled={disableServicesAccordion}
                      className={classes.unitsAccordion}
                      adornment={<FormatListBulleted className={classes.iconPadding} />}
                      titleContent={(
                        <Typography className={classes.captionText} variant="caption">
                          <FormattedMessage
                            id="area.geographicalServices.statistical_district"
                            values={{ length: filteredSubdistrictUnitsLength }}
                          />
                        </Typography>
                      )}
                      collapseContent={(
                        <StatisticalDistrictUnitList
                          handleUnitCheckboxChange={handleUnitCheckboxChange}
                          selectedServices={selectedServices}
                          title={serviceTitle}
                        />
                      )}
                    />
                    <Typography className={classes.statisticalUnitInfo} component="p" variant="caption">
                      <FormattedMessage id="area.statisticalDistrict.info" />
                    </Typography>
                    <StatisticalDistrictListContent
                      shownLayer={layer}
                    />
                  </div>
                )}
              />
            </ListItem>
          );
        })
      );
    }
    return component;
  };

  const renderLayerCategories = () => {
    if (layerCategoryKeys.length) {
      return (
        <List className={`${classes.listNoPadding} ${classes.listLevelTwo}`}>
          {
            layerCategoryKeys.map((key) => {
              const layerCategory = layerCategories[key];
              const selected = layerCategory.type === selectedCategory;
              const titleText = `${formatMessage({ id: `area.list.statistic.${layerCategory.type}` })} ${layerCategory.year}`;
              return (
                <ListItem
                  divider
                  disableGutters
                  key={key}
                  className={`${classes.listItem} ${key}`}
                >
                  <SMAccordion // Top level categories
                    className={classes.statisticalCategoryAccordion}
                    defaultOpen={false}
                    disableUnmount
                    onOpen={(e, open) => handleCategoryAccoridonToggle(layerCategory.type, !open)}
                    isOpen={selected}
                    disabled={isFetchingDistricts}
                    elevated={selected}
                    titleContent={(
                      <Typography id={`${key}Name`}>
                        {titleText}
                      </Typography>
                    )}
                    collapseContent={(
                      <List className={`${classes.listNoPadding} ${classes.listLevelThree}`}>
                        {renderLayers(layerCategory)}
                      </List>
                    )}
                  />
                </ListItem>
              );
            })
          }
        </List>
      );
    }
    return <StyledNoDataTypography aria-live="polite" variant="body2"><FormattedMessage id="area.statisticalDistrict.noData" /></StyledNoDataTypography>;
  };

  return (
    <>
      { isFetchingDistricts
        ? (
          <StyledLoadingContainer>
            <Loading
              reducer={{
                isFetching: isFetchingDistricts,
              }}
            />
          </StyledLoadingContainer>
        ) : renderLayerCategories()
      }
    </>
  );
};

StatisticalDistrictListComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StatisticalDistrictListComponent;

const StyledLoadingContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const StyledNoDataTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
}));
