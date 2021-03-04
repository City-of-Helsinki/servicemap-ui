import {
  Checkbox, List, ListItem, Typography,
} from '@material-ui/core';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import UnitItem from '../../../../components/ListItems/UnitItem';
import SMAccordion from '../../../../components/SMAccordion';
import { addSelectedDistrictService, removeSelectedDistrictService } from '../../../../redux/actions/district';
import { getFilteredSubdistrictServices } from '../../../../redux/selectors/district';
import { uppercaseFirst } from '../../../../utils';


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


const GeographicalUnitList = ({ getLocaleText, handleOpen, classes }) => {
  const dispatch = useDispatch();
  const areaViewState = useSelector(state => state.districts.areaViewState);
  const filteredSubdistrictUnits = useSelector(state => getFilteredSubdistrictServices(state));
  const [initialOpenItems] = useState(areaViewState?.openItems || []);
  const selectedServices = useSelector(state => state.districts.selectedDistrictServices);
  const [serviceList, setServiceList] = useState([]);
  const [initialCheckedItems] = useState(selectedServices);


  const handleUnitCheckboxChange = useCallback((event, id) => {
    if (event.target.checked) {
      dispatch(addSelectedDistrictService(id));
    } else {
      dispatch(removeSelectedDistrictService(id));
    }
  }, []);

  const sortUnitCategories = (categories) => {
    categories.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));
  };


  const createServiceCategories = () => {
    const servicesArray = [];
    const educationServicesArray = [];

    filteredSubdistrictUnits.map((unit) => {
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

    sortUnitCategories(servicesArray);
    sortUnitCategories(educationServicesArray);
    const serviceList = [...servicesArray, ...educationServicesArray];

    // Remove selected empty categories
    const emptyCategories = selectedServices.filter(id => !serviceList.some(obj => obj.id === id));
    if (emptyCategories.length) {
      dispatch(removeSelectedDistrictService(emptyCategories));
    }
    setServiceList(serviceList);
  };


  useEffect(() => {
    createServiceCategories();
  }, [filteredSubdistrictUnits]);


  // Render list of units for neighborhood and postcode-area subdistricts
  const renderUnitList = useMemo(() => (
    <div className={classes.unitListArea}>
      <List disablePadding>
        {serviceList.map(category => (
          <ListItem
            key={`${category.id}${category.period ? category.period[0] : ''}`}
            disableGutters
            className={classes.listItem}
            divider
          >
            <SMAccordion
              className={classes.serviceTitle}
              onOpen={() => handleOpen(category)}
              defaultOpen={initialOpenItems.includes(category.id)}
              titleContent={(
                <div>
                  <Typography>
                    {`${uppercaseFirst(getLocaleText(category.name))} (${category.units.length})`}
                  </Typography>
                  <Typography aria-hidden className={classes.captionText} variant="caption">
                    {`${category.period ? `${category.period[0]}-${category.period[1]}` : ''}`}
                  </Typography>
                </div>
              )}
              adornment={(
                <UnitCheckbox
                  id={category.id}
                  handleUnitCheckboxChange={handleUnitCheckboxChange}
                  classes={classes}
                  defaultChecked={initialCheckedItems.includes(category.id)}
                />
              )}
              collapseContent={(
                <List className={classes.unitList} disablePadding>
                  {category.units.map((unit, i) => (
                    <UnitItem
                      key={`${unit.id}-${category.id}`}
                      unit={unit}
                      divider={i !== category.units.length - 1}
                    />
                  ))}
                </List>
              )}
            />
          </ListItem>
        ))}
      </List>
    </div>
  ), [serviceList]);

  return renderUnitList;
};
GeographicalUnitList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
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

export default GeographicalUnitList;
