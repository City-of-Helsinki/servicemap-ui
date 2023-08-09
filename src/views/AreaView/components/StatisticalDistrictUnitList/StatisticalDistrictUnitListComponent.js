import { css } from '@emotion/css';
import { Clear } from '@mui/icons-material';
import {
  Button, Checkbox, IconButton, InputBase, List, Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { UnitItem } from '../../../../components';
import {
  getOrderedStatisticalDistrictServices, getServiceFilteredStatisticalDistrictUnits,
} from '../../../../redux/selectors/statisticalDistrict';
import { keyboardHandler, uppercaseFirst } from '../../../../utils';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  StyledAccordionServiceTitle, StyledCheckBoxIcon,
  StyledListItem,
  StyledUnitList,
  StyledUnitListArea,
} from '../styled/styled';

// Custom uncontrolled checkbox that allows default value
const UnitCheckbox = ({
  handleUnitCheckboxChange, id, defaultChecked, inputProps,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e) => {
    setChecked(!checked);
    handleUnitCheckboxChange(e, id);
  };

  return (
    <Checkbox
      color="primary"
      inputProps={inputProps}
      icon={<StyledCheckBoxIcon />}
      checked={checked}
      onChange={e => handleChange(e)}
    />
  );
};

const StatisticalDistrictUnitListComponent = ({
  handleUnitCheckboxChange,
  selectedServices,
  title,
}) => {
  const inputRef = useRef();
  const { formatMessage } = useIntl();
  const getLocaleText = useLocaleText();
  const theme = useTheme();
  const statisticalDistrictUnits = useSelector(getServiceFilteredStatisticalDistrictUnits);
  const [initialCheckedItems] = useState(selectedServices || []);
  const [filterValue, setFilterValue] = useState('');
  const services = useSelector(getOrderedStatisticalDistrictServices);
  const filteredServiceList = services.filter((category) => {
    if (filterValue === '') return true;
    if (selectedServices[category.id]) return true;
    return getLocaleText(category.name).includes(filterValue);
  });

  const handlefilterButtonClick = () => {
    if (inputRef) {
      setFilterValue(inputRef.current.value);
    }
  };
  const serviceFilterInputClass = css({
    margin: theme.spacing(1),
  });
  const serviceFilterButtonLabelClass = css({
    flexDirection: 'column',
  });
  const serviceFilterButtonFocusClass = css({
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main} !important`,
  });

  // Render list of units for neighborhood and postcode-area subdistricts
  const renderServiceList = useMemo(() => (
    <StyledUnitListArea>
      <StyledServiceFilterContainer>
        {
          typeof title === 'string' && (
            <StyledServiceFilterText id="ServiceListTitle" variant="body2">{title}</StyledServiceFilterText>
          )
        }
        <StyledRowContainer>
          <StyledServiceFilter
            inputRef={inputRef}
            inputProps={{
              className: serviceFilterInputClass,
              'aria-labelledby': 'ServiceListTitle',
            }}
            type="text"
            onKeyPress={keyboardHandler(() => handlefilterButtonClick(), ['enter'])}
            endAdornment={
              filterValue
                ? (
                  <IconButton
                    aria-label={formatMessage({ id: 'search.cancelText' })}
                    onClick={() => {
                      inputRef.current.value = '';
                      setFilterValue('');
                    }}
                  >
                    <Clear />
                  </IconButton>
                )
                : null
            }
          />
          <StyledServiceFilterButton
            id="ServiceListFilterButton"
            aria-label={formatMessage({ id: 'area.statisticalDistrict.service.filter.button.aria' })}
            disableRipple
            disableFocusRipple
            classes={{
              label: serviceFilterButtonLabelClass,
              focusVisible: serviceFilterButtonFocusClass,
            }}
            onClick={handlefilterButtonClick}
            color="secondary"
            variant="contained"
          >
            <Typography variant="caption" color="inherit"><FormattedMessage id="area.statisticalDistrict.service.filter.button" /></Typography>
          </StyledServiceFilterButton>
        </StyledRowContainer>
      </StyledServiceFilterContainer>
      <Typography aria-live="assertive" variant="body2" style={visuallyHidden}>
        {
          filterValue && filterValue !== ''
          && formatMessage({ id: 'area.statisticalDistrict.service.filter.aria.notification' }, { filterValue })
        }
      </Typography>
      <List disablePadding>
        {filteredServiceList.map((service) => {
          const units = statisticalDistrictUnits
            .filter(u => u?.services?.some(s => s.id === service.id));
          const disableUnitAccordion = !selectedServices[service.id] || units.length === 0;
          const titleText = `${uppercaseFirst(getLocaleText(service.name))} ${selectedServices[service.id] ? `(${units.length})` : ''}`;
          return (
            <StyledListItem
              key={`${service.id}${service.period ? service.period[0] : ''}`}
              disableGutters
              divider
            >
              <StyledAccordionServiceTitle
                disabled={disableUnitAccordion}
                titleContent={(
                  <div>
                    <Typography>
                      {titleText}
                    </Typography>
                  </div>
                )}
                adornment={(
                  <UnitCheckbox
                    id={service.id}
                    handleUnitCheckboxChange={handleUnitCheckboxChange}
                    defaultChecked={!!initialCheckedItems[service.id]}
                    inputProps={{
                      'aria-label': titleText,
                    }}
                  />
                )}
                collapseContent={(
                  <StyledUnitList disablePadding>
                    {units.map((unit, i) => (
                      <UnitItem
                        key={`${unit.id}-${service.id}`}
                        unit={unit}
                        divider={i !== units.length - 1}
                      />
                    ))}
                  </StyledUnitList>
                )}
              />
            </StyledListItem>
          );
        })}
      </List>
    </StyledUnitListArea>
  ), [filteredServiceList, filterValue]);

  return renderServiceList;
};

UnitCheckbox.propTypes = {
  handleUnitCheckboxChange: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  id: PropTypes.number.isRequired,
  inputProps: PropTypes.shape({
    'aria-label': PropTypes.string,
  }),
};

UnitCheckbox.defaultProps = {
  defaultChecked: false,
  inputProps: {},
};

export default StatisticalDistrictUnitListComponent;

const StyledRowContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const StyledServiceFilterContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  paddingLeft: 72,
  display: 'flex',
  flexDirection: 'column',
}));
const StyledServiceFilterText = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  fontWeight: 'bold',
}));
const StyledServiceFilter = styled(InputBase)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  flex: '1 0 auto',
}));
const StyledServiceFilterButton = styled(Button)(({ theme }) => ({
  flex: '0 0 auto',
  borderRadius: 0,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  boxShadow: 'none',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  '& svg': {
    fontSize: 20,
    marginBottom: theme.spacing(0.5),
  },
  flexDirection: 'column',
}));
