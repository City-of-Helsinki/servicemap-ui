import {
  Checkbox, IconButton, InputBase, List, ListItem, Typography,
} from '@mui/material';
import React, {
  useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Clear } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { uppercaseFirst } from '../../../../utils';
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
  handleUnitCheckboxChange, id, defaultChecked, classes,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e) => {
    setChecked(!checked);
    handleUnitCheckboxChange(e, id);
  };

  return (
    <Checkbox
      color="primary"
      icon={<span className={classes.checkBoxIcon} />}
      aria-hidden
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

  // Render list of units for neighborhood and postcode-area subdistricts
  const renderServiceList = useMemo(() => (
    <div className={classes.unitListArea}>
      <div className={classes.serviceFilterContainer}>
        {
          typeof title === 'string' && (
            <Typography className={classes.serviceFilterText} variant="body2">{title}</Typography>
          )
        }
        <InputBase
          inputProps={{
            className: classes.serviceFilterInput,
            // role: 'combobox',
            // 'aria-haspopup': !!showSuggestions,
            // 'aria-label': formatMessage({ id: 'search.searchField' }),
            // 'aria-owns': showSuggestions ? listID : null,
            // 'aria-activedescendant': showSuggestions ? `suggestion${focusedSuggestion}` : null,
          }}
          value={filterValue}
          type="text"
          className={classes.serviceFilter}
          onChange={(e) => {
            setFilterValue(e.currentTarget.value);
          }}
          endAdornment={
            filterValue
              ? (
                <IconButton
                  aria-label={formatMessage({ id: 'search.cancelText' })}
                  className={classes.cancelButton}
                  onClick={() => {
                    setFilterValue('');
                  }}
                >
                  <Clear />
                </IconButton>
              )
              : null
          }
        />
      </div>
      <List disablePadding>
        {filteredServiceList.map((service) => {
          const units = statisticalDistrictUnits
            .filter(u => u?.services?.some(s => s.id === service.id));
          const titleText = `${uppercaseFirst(getLocaleText(service.name))} ${units.length ? `(${units.length})` : ''}`;
          const disableUnitAccordion = units.length === 0;
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
};

UnitCheckbox.defaultProps = {
  defaultChecked: false,
};

export default StatisticalDistrictUnitListComponent;
