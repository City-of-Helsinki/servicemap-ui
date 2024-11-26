import { Checkbox, List, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { UnitItem } from '../../../../components';
import {
  addSelectedDistrictService,
  handleOpenItems,
  removeSelectedDistrictService,
} from '../../../../redux/actions/district';
import {
  getFilteredSubdistrictServices,
  selectSelectedDistrictServices,
} from '../../../../redux/selectors/district';
import { getLocale } from '../../../../redux/selectors/user';
import { keyboardHandler, uppercaseFirst } from '../../../../utils';
import { orderUnits } from '../../../../utils/orderUnits';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  StyledAccordionServiceTitle,
  StyledCaptionText,
  StyledCheckBoxIcon,
  StyledListItem,
  StyledUnitList,
  StyledUnitListArea,
} from '../styled/styled';
import ServiceFilterContainer from '../ServiceFilterContainer/ServiceFilterContainer';

// Custom uncontrolled checkbox that allows default value
const UnitCheckbox = ({
  handleUnitCheckboxChange, id, defaultChecked,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e) => {
    setChecked(!checked);
    handleUnitCheckboxChange(e, id);
  };

  return (
    <Checkbox
      color="primary"
      icon={<StyledCheckBoxIcon />}
      aria-hidden
      checked={checked}
      onChange={e => handleChange(e)}
    />
  );
};


const GeographicalUnitList = ({ initialOpenItems }) => {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const filteredSubdistrictUnits = useSelector(getFilteredSubdistrictServices);
  const selectedServices = useSelector(selectSelectedDistrictServices);
  const locale = useSelector(getLocale);
  const [serviceList, setServiceList] = useState([]);
  const [initialCheckedItems] = useState(selectedServices);
  const inputRef = useRef();
  const { formatMessage } = useIntl();
  const [filterValue, setFilterValue] = useState('');
  const title = formatMessage({ id: 'area.service.filter' });

  const handlefilterButtonClick = () => {
    if (inputRef) {
      setFilterValue(inputRef.current.value);
    }
  };

  const handleUnitCheckboxChange = useCallback((event, id) => {
    if (event.target.checked) {
      dispatch(addSelectedDistrictService(id));
    } else {
      dispatch(removeSelectedDistrictService(id));
    }
  }, []);

  const sortUnitCategories = (categories) => {
    return orderUnits(categories, { locale, direction: 'desc', order: 'alphabetical' });
  };


  const createServiceCategories = () => {
    const servicesArray = [];
    const educationServicesArray = [];

    filteredSubdistrictUnits.forEach((unit) => {
      const categories = unit.services;
      categories.forEach((category) => {
        let serviceList;
        if (category.period) { // Add educational services to own list.
          serviceList = educationServicesArray;
        } else {
          serviceList = servicesArray;
        }
        const serviceCategory = serviceList.find(service => service.id === category.id);
        if (!serviceCategory) {
          serviceList.push({
            id: category.id,
            units: [unit],
            name: category.name,
            period: category.period,
          });
        } else if (!serviceCategory.units.some(listUnit => listUnit.id === unit.id)) {
          serviceCategory.units.push(unit);
        }
      });
      return null;
    });

    const serviceList = [
      ...sortUnitCategories(servicesArray),
      ...sortUnitCategories(educationServicesArray),
    ];
    serviceList.forEach((service) => {
      service.units = sortUnitCategories(service.units);
    });

    // Remove selected empty categories
    const emptyCategories = selectedServices.filter(id => !serviceList.some(obj => obj.id === id));
    if (emptyCategories.length) {
      dispatch(removeSelectedDistrictService(emptyCategories));
    }

    // Use filter
    if (filterValue) {
      const filteredServiceList = serviceList.filter((category) => {
        const name = getLocaleText(category.name);
        return name.toLowerCase().includes(filterValue.toLowerCase());
      });
      setServiceList(filteredServiceList);
      return;
    }

    setServiceList(serviceList);
  };


  useEffect(() => {
    createServiceCategories();
  }, [filteredSubdistrictUnits, filterValue]);

  // Render list of units for neighborhood and postcode-area subdistricts
  const renderUnitList = useMemo(() => (
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
      <List disablePadding>
        {serviceList.map(category => (
          <StyledListItem
            key={`${category.id}${category.period ? category.period[0] : ''}`}
            disableGutters
            divider
          >
            <StyledAccordionServiceTitle
              onOpen={() => dispatch(handleOpenItems(category.id))}
              defaultOpen={initialOpenItems.includes(category.id)}
              titleContent={(
                <div>
                  <Typography>
                    {`${uppercaseFirst(getLocaleText(category.name))} (${category.units.length})`}
                  </Typography>
                  <StyledCaptionText aria-hidden variant="caption">
                    {`${category.period ? `${category.period[0]}-${category.period[1]}` : ''}`}
                  </StyledCaptionText>
                </div>
              )}
              adornment={(
                <UnitCheckbox
                  id={category.id}
                  handleUnitCheckboxChange={handleUnitCheckboxChange}
                  defaultChecked={initialCheckedItems.includes(category.id)}
                />
              )}
              collapseContent={(
                <StyledUnitList disablePadding>
                  {category.units.map((unit, i) => (
                    <UnitItem
                      key={`${unit.id}-${category.id}`}
                      unit={unit}
                      divider={i !== category.units.length - 1}
                    />
                  ))}
                </StyledUnitList>
              )}
            />
          </StyledListItem>
        ))}
      </List>
    </StyledUnitListArea>
  ), [serviceList]);

  return renderUnitList;
};

UnitCheckbox.propTypes = {
  handleUnitCheckboxChange: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  id: PropTypes.number.isRequired,
};

UnitCheckbox.defaultProps = {
  defaultChecked: false,
};

export default GeographicalUnitList;
