import {
  Checkbox, List, Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
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
import ServiceFilterContainer from '../ServiceFilterContainer/ServiceFilterContainer';

// Custom uncontrolled checkbox that allows default value
const UnitCheckbox = ({
  handleUnitCheckboxChange,
  id,
  defaultChecked = false,
  inputProps = {},
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
    <StyledUnitListArea>
      <ServiceFilterContainer
        title={title}
        inputRef={inputRef}
        keyboardHandler={keyboardHandler}
        handlefilterButtonClick={handlefilterButtonClick}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        formatMessage={formatMessage}
      />
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

export default StatisticalDistrictUnitListComponent;
