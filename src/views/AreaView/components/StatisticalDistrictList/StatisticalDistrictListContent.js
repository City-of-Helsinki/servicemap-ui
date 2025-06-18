import { css } from '@emotion/css';
import {
  Checkbox, FormControlLabel, List, styled, Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SMAccordion } from '../../../../components';
import {
  addAreaSelection, removeAreaSelection, replaceAreaSelection,
} from '../../../../redux/actions/statisticalDistrict';
import { selectMapRef } from '../../../../redux/selectors/general';
import {
  getCityGroupedData, getStatisticalDistrictAreaSelections, getStatisticalDistrictSelection,
} from '../../../../redux/selectors/statisticalDistrict';
import useLocaleText from '../../../../utils/useLocaleText';
import { focusDistricts } from '../../../MapView/utils/mapActions';
import {
  StyledAreaListItem, StyledBoldText, StyledCheckBoxIcon, StyledListItem, StyledListNoPadding,
} from '../styled/styled';

const StatisticalDistrictListContent = () => {
  const dispatch = useDispatch();
  const cityFilteredData = useSelector(getCityGroupedData);
  const getLocaleText = useLocaleText();
  const areaSelections = useSelector(getStatisticalDistrictAreaSelections);
  const selection = useSelector(getStatisticalDistrictSelection);
  const { formatMessage } = useIntl();
  const map = useSelector(selectMapRef);

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
    const isTotal = selection?.section === 'ALL';
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

  const statisticalCategoryTitleClass = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '1 1 auto',
  });
  return (
    <>
      <StyledMunicipalitySubtitle>
        <StyledBoldText component="p">
          <FormattedMessage id="area.statisticalDistrict.title" />
        </StyledBoldText>
        {
          cityFilteredData.length === 0
          && (
            <Typography variant="body2"><FormattedMessage id="area.city.selection.empty" /></Typography>
          )
        }
      </StyledMunicipalitySubtitle>
      <List id="StatisticalCityList">
        {
          cityFilteredData.map((data) => {
            const { municipality } = data[0];
            const someChildIsChecked = data.some(node => areaSelections[`${node.id}`]);
            const someChildNotChecked = data.some(node => !areaSelections[`${node.id}`]);
            const isChecked = someChildIsChecked && !someChildNotChecked;
            const isIndeterminate = someChildIsChecked && someChildNotChecked;
            return (
              <StyledListItem
                disableGutters
                key={municipality}
              >
                <React.Fragment key={municipality}>
                  <StyledSMAccordion // City list accordion
                    defaultOpen={false}
                    disableUnmount
                    adornment={(
                      <StyledFormControlLabel
                        classes={{
                          label: statisticalCategoryTitleClass,
                        }}
                        control={(
                          <Checkbox
                            color="primary"
                            inputProps={{
                              'aria-label': formatMessage({ id: `settings.city.${municipality}` }),
                            }}
                            icon={<StyledCheckBoxIcon />}
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
                      <StyledListNoPadding>
                        {
                          data.map(district => (
                            <StyledAreaListItem key={district.id} divider>
                              <StyledFormControlLabelAdjusted
                                classes={{
                                  label: statisticalCategoryTitleClass,
                                }}
                                control={(
                                  <Checkbox
                                    color="primary"
                                    inputProps={{
                                      'aria-label': `${getLocaleText(district.name)}, ${getDistrictDataInfo(district)}`,
                                    }}
                                    icon={<StyledCheckBoxIcon />}
                                    onChange={e => handleCheckboxChange(e, district)}
                                    checked={areaSelections[`${district.id}`] || false}
                                  />
                              )}
                                label={(
                                  <StyledLabelTypography variant="body2" aria-hidden>
                                    <span>
                                      {`${getLocaleText(district.name)}`}
                                    </span>
                                    <StyledLabelInfo>
                                      {getDistrictDataInfo(district)}
                                    </StyledLabelInfo>
                                  </StyledLabelTypography>
                                )}
                              />
                            </StyledAreaListItem>
                          ))
                        }
                      </StyledListNoPadding>
                    )}
                  />
                </React.Fragment>
              </StyledListItem>
            );
          })
        }
      </List>
    </>
  );
};

export default StatisticalDistrictListContent;

const StyledLabelTypography = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: `${theme.spacing(1)} 0`,
}));
const StyledLabelInfo = styled('span')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
const StyledMunicipalitySubtitle = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(9),
}));
const StyledSMAccordion = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(9),
}));
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  marginRight: 0,
  display: 'flex',
  flex: '1 1 auto',
}));
const StyledFormControlLabelAdjusted = styled(FormControlLabel)(({ theme }) => ({
  paddingLeft: theme.spacing(6),
  display: 'flex',
  flex: '1 1 auto',
}));
