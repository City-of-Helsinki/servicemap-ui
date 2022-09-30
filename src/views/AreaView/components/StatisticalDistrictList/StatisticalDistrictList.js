import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FormatListBulleted } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import dataVisualization from '../../../../utils/dataVisualization';
import { SMAccordion } from '../../../../components';
import DistrictToggleButton from '../DistrictToggleButton';
import styles from '../../styles';
import {
  getStatisticalDistrictAreaSelections,
  getCityFilteredDistricts,
  getStatisticalDistrictSelectedServices,
  getStatisticalDistrictSelection,
  getStatisticalDistrictUnits,
} from '../../../../redux/selectors/statisticalDistrict';
import {
  addAreaSelection,
  addSelectedService,
  fetchServices,
  fetchStatisticalDistrictServiceUnits,
  fetchStatisticalDistricts,
  removeAreaSelection,
  removeSelectedService,
  replaceAreaSelection,
  selectStatisticalDistrict,
} from '../../../../redux/actions/statisticalDistrict';
import useLocaleText from '../../../../utils/useLocaleText';
import StatisticalDistrictUnitList from '../StatisticalDistrictUnitList';


const StatisticalDistrictListContent = withStyles(styles)(({
  classes,
}) => {
  const dispatch = useDispatch();
  const cityFilteredData = useSelector(getCityFilteredDistricts);
  const getLocaleText = useLocaleText();
  const areaSelections = useSelector(getStatisticalDistrictAreaSelections);
  const selection = useSelector(getStatisticalDistrictSelection);
  const [citySelections, setCitySelections] = useState([]);
  const { formatMessage } = useIntl();

  const handleCheckboxChange = (e, district) => {
    const { id } = district;
    if (typeof id === 'number') {
      if (e.target.checked) {
        dispatch(addAreaSelection(id));
      } else {
        dispatch(removeAreaSelection(id));
      }
    }
  };

  const handleMultiSelect = (e, toBeChecked, city) => {
    if (toBeChecked) {
      setCitySelections([...citySelections, city]);
      const newAreaSelections = {
        ...areaSelections,
      };
      cityFilteredData.forEach((dataSet) => {
        if (dataSet[0].municipality === city) {
          dataSet.forEach((district) => {
            newAreaSelections[district.id] = true;
          });
        }
      });
      dispatch(replaceAreaSelection(newAreaSelections));
    } else {
      // Handle unchecking city selection
      setCitySelections([citySelections.filter(v => v !== city)]);
      const toBeRemovedSelections = cityFilteredData
        .filter(v => v[0].municipality === city)[0]
        .map(district => district.id);
      const newAreaSelections = {
        ...areaSelections,
      };
      toBeRemovedSelections.forEach((key) => {
        newAreaSelections[key] = false;
      });
      dispatch(replaceAreaSelection(newAreaSelections));
    }
  };

  const getDistrictDataInfo = (district) => {
    const isTotal = selection?.section === 'total';
    const hasValue = typeof district.selectedValue === 'number';
    let id;

    if (!hasValue) {
      id = 'area.statisticalDistrict.label.noResults';
    } else if (isTotal) {
      id = 'area.statisticalDistrict.label.people';
    } else {
      id = 'area.statisticalDistrict.label';
    }

    return formatMessage(
      { id },
      {
        count: district.selectedValue,
        percent: !isTotal && district.selectedProportion.toFixed(2),
      },
    );
  };

  return (
    <>
      <div className={classes.municipalitySubtitle}>
        <Typography component="h4" className={classes.bold}>
          <FormattedMessage id="area.statisticalDistrict.title" />
        </Typography>
      </div>
      {
        cityFilteredData.map((data) => {
          const { municipality } = data[0];
          const isChecked = citySelections.some(v => v === municipality);
          return (
            <React.Fragment key={municipality}>
              <div className={classes.municipalitySubtitle}>
                <FormControlLabel
                  className={classes.municipalityCheckbox}
                  control={(
                    <Checkbox
                      color="primary"
                      icon={<span className={classes.checkBoxIcon} />}
                      onChange={e => handleMultiSelect(e, !isChecked, municipality)}
                      checked={isChecked}
                    />
                  )}
                  label={(
                    <Typography component="h5" className={classes.bold}>
                      <FormattedMessage id={`settings.city.${municipality}`} />
                    </Typography>
                  )}
                />
              </div>
              <List disablePadding>
                {
                  data.map(district => (
                    <ListItem className={`${classes.listItem} ${classes.areaItem}`} key={district.id} divider>
                      <FormControlLabel
                        className={classes.municipalityAdjustedCheckboxPadding}
                        classes={{
                          label: classes.statisticalCategoryTitle,
                        }}
                        control={(
                          <Checkbox
                            color="primary"
                            icon={<span className={classes.checkBoxIcon} />}
                            onChange={e => handleCheckboxChange(e, district)}
                            checked={areaSelections[`${district.id}`] || false}
                          />
                      )}
                        label={(
                          <>
                            <Typography variant="body2">
                              {`${getLocaleText(district.name)}`}
                            </Typography>
                            <Typography variant="body2">
                              {getDistrictDataInfo(district)}
                            </Typography>
                          </>
                        )}
                      />
                    </ListItem>
                  ))
                }
              </List>
            </React.Fragment>
          );
        })
      }
    </>
  );
});

StatisticalDistrictListContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

const StatisticalDistrictListComponent = ({
  classes,
}) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { section } = useSelector(getStatisticalDistrictSelection);
  const statisticalLayers = dataVisualization.getStatisticsLayers();
  const units = useSelector(getStatisticalDistrictUnits);
  const filteredSubdistrictUnitsLength = units?.length || 0;
  const selectedServices = useSelector(getStatisticalDistrictSelectedServices);
  const selectedAreas = useSelector(getStatisticalDistrictAreaSelections);

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

  const handleAccordionToggle = (districtCategory, opening) => {
    if (opening) {
      dispatch(selectStatisticalDistrict(districtCategory));
    } else {
      dispatch(selectStatisticalDistrict(undefined));
    }
  };

  return statisticalLayers.map((layer) => {
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
          onOpen={(e, open) => handleAccordionToggle(layer, !open)}
          isOpen={selected}
          elevated={selected}
          adornment={(
            <DistrictToggleButton
              selected={selected}
              district={layer}
              onToggle={() => handleAccordionToggle(layer, section !== layer)}
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
  });
};

StatisticalDistrictListComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StatisticalDistrictListComponent;
