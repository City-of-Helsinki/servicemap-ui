import {
  Button,
  Checkbox,
  IconButton,
  InputBase,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import React, {
  useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Clear } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { keyboardHandler, uppercaseFirst } from '../../../../utils';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  SMAccordion,
  UnitItem,
} from '../../../../components';
import {
  getOrderedStatisticalDistrictServices,
  getServiceFilteredStatisticalDistrictUnits,
} from '../../../../redux/selectors/statisticalDistrict';


// Custom uncontrolled checkbox that allows default value
const UnitCheckbox = ({
  handleUnitCheckboxChange, id, defaultChecked, classes, inputProps,
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
      icon={<span className={classes.checkBoxIcon} />}
      checked={checked}
      onChange={e => handleChange(e)}
    />
  );
};


const StatisticalDistrictUnitListComponent = ({
  classes,
  handleUnitCheckboxChange,
  selectedServices,
  title,
}) => {
  const inputRef = useRef();
  const { formatMessage } = useIntl();
  const getLocaleText = useLocaleText();
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

  // Render list of units for neighborhood and postcode-area subdistricts
  const renderServiceList = useMemo(() => (
    <div className={classes.unitListArea}>
      <div className={classes.serviceFilterContainer}>
        {
          typeof title === 'string' && (
            <Typography id="ServiceListTitle" className={classes.serviceFilterText} variant="body2">{title}</Typography>
          )
        }
        <StyledRowContainer>
          <InputBase
            inputRef={inputRef}
            inputProps={{
              className: classes.serviceFilterInput,
              'aria-labelledby': 'ServiceListTitle',
            }}
            type="text"
            className={classes.serviceFilter}
            onKeyPress={keyboardHandler(() => handlefilterButtonClick(), ['enter'])}
            endAdornment={
              filterValue
                ? (
                  <IconButton
                    aria-label={formatMessage({ id: 'search.cancelText' })}
                    className={classes.cancelButton}
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
          <Button
            id="ServiceListFilterButton"
            aria-label={formatMessage({ id: 'area.statisticalDistrict.service.filter.button.aria' })}
            className={classes.serviceFilterButton}
            disableRipple
            disableFocusRipple
            classes={{
              label: classes.serviceFilterButtonLabel,
              focusVisible: classes.serviceFilterButtonFocus,
            }}
            onClick={handlefilterButtonClick}
            color="secondary"
            variant="contained"
          >
            <Typography variant="caption" color="inherit"><FormattedMessage id="area.statisticalDistrict.service.filter.button" /></Typography>
          </Button>
        </StyledRowContainer>
      </div>
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
            <ListItem
              key={`${service.id}${service.period ? service.period[0] : ''}`}
              disableGutters
              className={classes.listItem}
              divider
            >
              <SMAccordion
                className={classes.serviceTitle}
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
                    classes={classes}
                    defaultChecked={!!initialCheckedItems[service.id]}
                    inputProps={{
                      'aria-label': titleText,
                    }}
                  />
                )}
                collapseContent={(
                  <List className={classes.unitList} disablePadding>
                    {units.map((unit, i) => (
                      <UnitItem
                        key={`${unit.id}-${service.id}`}
                        unit={unit}
                        divider={i !== units.length - 1}
                      />
                    ))}
                  </List>
                )}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  ), [filteredServiceList, filterValue]);

  return renderServiceList;
};

StatisticalDistrictUnitListComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitCheckbox.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
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
