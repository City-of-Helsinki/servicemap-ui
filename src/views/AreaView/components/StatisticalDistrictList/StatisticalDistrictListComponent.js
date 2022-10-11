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
import dataVisualization from '../../../../utils/dataVisualization';
import { Loading, SMAccordion } from '../../../../components';
import DistrictToggleButton from '../DistrictToggleButton';
import {
  getStatisticalDistrictAreaSelections,
  getStatisticalDistrictSelectedServices,
  getStatisticalDistrictSelection,
  getStatisticalDistrictUnits,
  getStatisticalDistrictSelectedCategory,
  getStatisticalDistrictsIsFetching,
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
  // Keys in this object are currently used to get text translation IDs
  const layerCategories = {
    byAge: dataVisualization.getStatisticsLayers(),
    forecast: dataVisualization.getForecastsLayers(),
  };
  const units = useSelector(getStatisticalDistrictUnits);
  const filteredSubdistrictUnitsLength = units?.length || 0;
  const selectedServices = useSelector(getStatisticalDistrictSelectedServices);
  const selectedAreas = useSelector(getStatisticalDistrictAreaSelections);
  const selectedCategory = useSelector(getStatisticalDistrictSelectedCategory);
  const isFetchingDistricts = useSelector(getStatisticalDistrictsIsFetching);

  useEffect(() => {
    dispatch(fetchStatisticalDistricts());
    dispatch(fetchServices());
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
      dispatch(selectCategory(null));
    }
  };

  const renderLayers = (category) => {
    const layers = layerCategories[category];
    let component = null;
    if (layers) {
      const isForecast = category === 'forecast';
      component = (
        layers.map((layer) => {
          const selected = section === layer;
          const serviceTitle = formatMessage({ id: 'area.statisticalDistrict.service.filter' });
          const disableServicesAccordion = !Object.keys(selectedAreas).some(a => selectedAreas[a]);
          return (
            <ListItem
              divider
              disableGutters
              key={layer}
              className={`${classes.listItem} ${layer}`}
            >
              <SMAccordion // Top level categories
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
                  />
                )}
                titleContent={(
                  <Typography id={`${layer}Name`}>
                    <FormattedMessage id={`area.list.statistic.${layer}`} />
                  </Typography>
                )}
                collapseContent={(
                  <div className={classes.districtServiceList}>
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

  const renderLayerCategories = () => (
    Object.keys(layerCategories).map((key) => {
      const selected = key === selectedCategory;
      return (
        <ListItem
          divider
          disableGutters
          key={key}
          className={`${classes.listItem} ${key}`}
        >
          <SMAccordion // Top level categories
            defaultOpen={false}
            onOpen={(e, open) => handleCategoryAccoridonToggle(key, !open)}
            isOpen={selected}
            disabled={isFetchingDistricts}
            elevated={selected}
            titleContent={(
              <Typography id={`${key}Name`}>
                <FormattedMessage id={`area.list.statistic.${key}`} />
              </Typography>
            )}
            collapseContent={(
              <List>
                {renderLayers(key)}
              </List>
            )}
          />
        </ListItem>
      );
    }));

  return (
    <List>
      <>
        <Typography style={visuallyHidden} aria-live="assertive">
          {isFetchingDistricts
            ? <FormattedMessage id="general.loading" />
            : <FormattedMessage id="general.loading.done" />
          }
        </Typography>
        { isFetchingDistricts
          ? (
            <StyledLoadingContainer>
              <Loading
                reducer={{
                  isFetching: isFetchingDistricts,
                }}
              />
            </StyledLoadingContainer>
          ) : (
            <List>
              {renderLayerCategories()}
            </List>
          )
        }
      </>
    </List>
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
