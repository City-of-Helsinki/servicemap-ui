import React, { useState } from 'react';
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
  getCityFilteredDistricts,
  getStatisticalDistrictSelection,
} from '../../../../redux/selectors/statisticalDistrict';
import {
  addAreaSelection,
  removeAreaSelection,
  replaceAreaSelection,
} from '../../../../redux/actions/statisticalDistrict';
import useLocaleText from '../../../../utils/useLocaleText';
import { SMAccordion } from '../../../../components';


const StatisticalDistrictListContentComponent = ({
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

  const handleMultiSelect = (toBeChecked, city) => {
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
      setCitySelections(citySelections.filter(v => v !== city));
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
        <Typography component="h5" className={classes.bold}>
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
            const isChecked = citySelections.some(v => v === municipality);
            const childIsChecked = data.some(node => areaSelections[`${node.id}`]);
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
                            indeterminate={childIsChecked && !isChecked}
                          />
                        )}
                      />
                    )}
                    titleContent={(
                      <Typography component="h6" variant="body2">
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
                                  <StyledLabelTypography variant="body2" aria-hidden>
                                    <span>
                                      {`${getLocaleText(district.name)}`}
                                    </span>
                                    <span>
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
