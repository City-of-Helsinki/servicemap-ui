import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  styled,
  Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import styles from '../../styles';
import {
  getStatisticalDistrictAreaSelections,
  getCityGroupedData,
  getStatisticalDistrictSelection,
} from '../../../../redux/selectors/statisticalDistrict';
import {
  addAreaSelection,
  removeAreaSelection,
  replaceAreaSelection,
} from '../../../../redux/actions/statisticalDistrict';
import useLocaleText from '../../../../utils/useLocaleText';
import { SMAccordion } from '../../../../components';
import { focusDistricts } from '../../../MapView/utils/mapActions';


const StatisticalDistrictListContentComponent = ({
  classes,
}) => {
  const dispatch = useDispatch();
  const cityFilteredData = useSelector(getCityGroupedData);
  const getLocaleText = useLocaleText();
  const areaSelections = useSelector(getStatisticalDistrictAreaSelections);
  const selection = useSelector(getStatisticalDistrictSelection);
  const { formatMessage } = useIntl();
  const map = useSelector(state => state.mapRef);

  useEffect(() => {
    // Focus to districts when area selections change
    let districtsToFocus = cityFilteredData.flat();
    const filteredData = districtsToFocus.filter(district => areaSelections[district.id]);
    if (filteredData.length > 0) {
      districtsToFocus = filteredData;
    }

    if (districtsToFocus.length > 0) {
      focusDistricts(map, districtsToFocus);
    }
  }, [areaSelections, cityFilteredData]);

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

  const handleMultiSelect = (toBeChecked, city) => {
    if (toBeChecked) {
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

    if (!isTotal) {
      return (
        <>
          <span>
            <FormattedMessage id="area.statisticalDistrict.label.people" values={{ count: district.selectedValue }} />
            ,
          </span>
          <span>
            <FormattedMessage id="area.statisticalDistrict.label.percent" values={{ percent: district.selectedProportion.toFixed(2) }} />
          </span>
        </>
      );
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
        <Typography component="p" className={classes.bold}>
          <FormattedMessage id="area.statisticalDistrict.title" />
        </Typography>
        {
          cityFilteredData.length === 0
          && (
            <Typography variant="body2"><FormattedMessage id="area.city.selection.empty" /></Typography>
          )
        }
      </div>
      <List id="StatisticalCityList">
        {
          cityFilteredData.map((data) => {
            const { municipality } = data[0];
            const someChildIsChecked = data.some(node => areaSelections[`${node.id}`]);
            const someChildNotChecked = data.some(node => !areaSelections[`${node.id}`]);
            const isChecked = someChildIsChecked && !someChildNotChecked;
            const isIndeterminate = someChildIsChecked && someChildNotChecked;
            return (
              <ListItem
                divider
                disableGutters
                key={municipality}
                className={`${classes.listItem}`}
              >
                <React.Fragment key={municipality}>
                  <SMAccordion // City list accordion
                    defaultOpen={false}
                    disableUnmount
                    adornment={(
                      <FormControlLabel
                        className={classes.municipalityAdjustedCheckboxPadding}
                        classes={{
                          label: classes.statisticalCategoryTitle,
                        }}
                        control={(
                          <Checkbox
                            color="primary"
                            inputProps={{
                              'aria-label': formatMessage({ id: `settings.city.${municipality}` }),
                            }}
                            icon={<span className={classes.checkBoxIcon} />}
                            onChange={() => handleMultiSelect(!isChecked, municipality)}
                            checked={isChecked}
                            indeterminate={isIndeterminate}
                          />
                        )}
                      />
                    )}
                    titleContent={(
                      <Typography component="p" variant="body2">
                        <FormattedMessage id={`settings.city.${municipality}`} />
                      </Typography>
                    )}
                    collapseContent={(
                      <List className={classes.listNoPadding}>
                        {
                          data.map(district => (
                            <ListItem className={`${classes.listItem} ${classes.areaItem}`} key={district.id} divider>
                              <FormControlLabel
                                className={classes.statisticalAreaAdjustedCheckboxPadding}
                                classes={{
                                  label: classes.statisticalCategoryTitle,
                                }}
                                control={(
                                  <Checkbox
                                    color="primary"
                                    inputProps={{
                                      'aria-label': `${getLocaleText(district.name)}, ${getDistrictDataInfo(district)}`,
                                    }}
                                    icon={<span className={classes.checkBoxIcon} />}
                                    onChange={e => handleCheckboxChange(e, district)}
                                    checked={areaSelections[`${district.id}`] || false}
                                  />
                              )}
                                label={(
                                  <StyledLabelTypography variant="body2" aria-hidden className={classes.statisticalDistrictListItemLabel}>
                                    <span>
                                      {`${getLocaleText(district.name)}`}
                                    </span>
                                    <span className={classes.statisticalDistrictListItemLabelInfo}>
                                      {getDistrictDataInfo(district)}
                                    </span>
                                  </StyledLabelTypography>
                                )}
                              />
                            </ListItem>
                          ))
                        }
                      </List>
                    )}
                  />
                </React.Fragment>
              </ListItem>
            );
          })
        }
      </List>
    </>
  );
};

StatisticalDistrictListContentComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

const StatisticalDistrictListContent = withStyles(styles)(StatisticalDistrictListContentComponent);

export default StatisticalDistrictListContent;

const StyledLabelTypography = styled(Typography)`
  display: flex;
  flex-direction: column;
`;
