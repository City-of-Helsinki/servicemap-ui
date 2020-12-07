import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
} from '@material-ui/core';
import distance from '@turf/distance';
import { FormattedMessage } from 'react-intl';
import { ArrowDropDown, Cancel } from '@material-ui/icons';
import { AreaIcon, AddressIcon } from '../../../../components/SMIcon';
import { formatDistanceObject, uppercaseFirst } from '../../../../utils';
import DivisionItem from '../../../../components/ListItems/DivisionItem';
import UnitItem from '../../../../components/ListItems/UnitItem';
import SMButton from '../../../../components/ServiceMapButton';
import { getAddressFromUnit } from '../../../../utils/address';


const UnitTab = ({
  selectedDistrictData,
  selectedAddress,
  selectedSubdistricts,
  selectedDistrictServices,
  setSelectedDistrictServices,
  filteredSubdistrictUnits,
  addressDistrict,
  formAddressString,
  getLocaleText,
  classes,
  intl,
}) => {
  const [checkedServices, setCheckedServices] = useState(selectedDistrictServices);

  const sortDistricts = (districts) => {
    districts.sort((a, b) => a.unit.distance - b.unit.distance);
  };

  const sortUnitCategories = (categories) => {
    categories.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));
  };

  const distanceToAddress = coord => (
    Math.round(distance(coord, selectedAddress.location.coordinates) * 1000)
  );

  const handleCheckboxChange = (event, category) => {
    let newArray;
    if (event.target.checked) {
      newArray = [...checkedServices, category.id];
    } else {
      newArray = checkedServices.filter(service => service !== category.id);
    }
    setCheckedServices(newArray);
    setSelectedDistrictServices(newArray);
  };

  useEffect(() => {
    setCheckedServices(selectedDistrictServices);
  }, [selectedDistrictServices]);

  const renderDistrictUnitItem = (district) => {
    const { unit } = district;
    const streetAddress = getAddressFromUnit(unit, getLocaleText, intl);
    return (
      <DivisionItem
        key={district.id}
        className={classes.divisionItem}
        divider
        data={{
          area: district,
          name: district.unit.name || null,
          id: district.unit.id,
          street_address: streetAddress,
        }}
        distance={district.unit.distance
          ? formatDistanceObject(intl, district.unit.distance)
          : null}
      />
    );
  };

  const renderUnitList = () => {
    // Render list of units for neighborhood and postcode-area subdistricts
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

    return (
      serviceList.map(category => (
        <ListItem
          className={classes.categoryItem}
          key={`${category.id}${category.period ? category.period[0] : ''}`}
        >
          <Accordion
            TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
            classes={{ root: classes.expandingElement }}
          >
            <AccordionSummary
              classes={{ root: classes.accordionSummary }}
              expandIcon={<ArrowDropDown />}
              id={`${category.id}-header`}
              aria-controls={`${category.id}-content`}
            >
              <FormControlLabel
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                control={(
                  <Checkbox
                    checked={checkedServices.includes(category.id)}
                    onChange={e => handleCheckboxChange(e, category)}
                  />
              )}
                label={(
                  <>
                    <Typography>
                      {`${uppercaseFirst(getLocaleText(category.name))} (${category.units.length})`}
                    </Typography>
                    <Typography aria-hidden className={classes.captionText} variant="caption">
                      {`${category.period ? `${category.period[0]}-${category.period[1]}` : ''}`}
                    </Typography>
                  </>
                )}
              />
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accoridonContent }} id={`${category.id}-content`}>
              <List classes={{ root: classes.fullWidth }} disablePadding>
                {category.units.map((unit, i) => (
                  <UnitItem
                    key={`${unit.id}-${category.id}`}
                    unit={unit}
                    divider={i !== category.units.length - 1}
                  />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </ListItem>
      ))
    );
  };


  const render = () => {
    if (!selectedDistrictData.length) {
      return (
        <div>
          <Typography className={classes.infoText} variant="body2">
            <FormattedMessage id="area.noSelection" />
          </Typography>
        </div>
      );
    }

    if (selectedSubdistricts.length) {
      // If geographical subdistrict is selected, list units within the district
      return (
        <div className={classes.unitListArea}>
          <SMButton
            className={classes.deleteButton}
            disabled={!checkedServices.length}
            messageID="services.selections.delete.all"
            icon={<Cancel className={classes.deleteIcon} />}
            role="button"
            margin
            color="primary"
            onClick={() => {
              setCheckedServices([]);
              setSelectedDistrictServices([]);
            }}
          />
          <List disablePadding>
            {renderUnitList()}
          </List>
        </div>
      );
    }

    if (selectedAddress) {
      const localDistrict = selectedDistrictData.filter(obj => obj.id === addressDistrict);
      const otherDistricts = selectedDistrictData.filter(obj => obj.id !== addressDistrict);

      const localUnitDistricts = [];
      localDistrict.forEach((district) => {
        if (district.unit) {
          const newValue = district;
          newValue.unit.distance = distanceToAddress(district.unit.location.coordinates);
          localUnitDistricts.push(newValue);
        }
        if (district.overlaping) {
          district.overlaping.forEach((obj) => {
            if (obj.unit) {
              const newValue = obj;
              newValue.unit.distance = distanceToAddress(obj.unit.location.coordinates);
              localUnitDistricts.push(newValue);
            }
          });
        }
      });
      const otherUnitDistricts = [];
      otherDistricts.forEach((district) => {
        if (district.municipality === selectedAddress.street.municipality) {
          if (district.unit) {
            const newValue = district;
            newValue.unit.distance = distanceToAddress(district.unit.location.coordinates);
            otherUnitDistricts.push(newValue);
          }
          if (district.overlaping) {
            district.overlaping.forEach((obj) => {
              if (obj.unit) {
                const newValue = obj;
                newValue.unit.distance = distanceToAddress(obj.unit.location.coordinates);
                otherUnitDistricts.push(newValue);
              }
            });
          }
        }
      });

      sortDistricts(localUnitDistricts);
      sortDistricts(otherUnitDistricts);

      return (
        <div>
          <div className={`${classes.subtitle} ${classes.sidePadding}`}>
            <AddressIcon className={`${classes.rightPadding} ${classes.addressIcon}`} />
            <Typography className={classes.selectedAddress}>
              {formAddressString(selectedAddress)}
            </Typography>
          </div>
          <Divider aria-hidden />

          {localUnitDistricts.length ? (
            <>
              <div className={`${classes.areaTitle} ${classes.sidePadding}`}>
                <AreaIcon className={classes.rightPadding} />
                <Typography component="h3" className={classes.bold}>
                  <FormattedMessage id="area.services.local" />
                </Typography>
              </div>
              <List>
                {localUnitDistricts.map(district => (
                  renderDistrictUnitItem(district)
                ))}
              </List>
            </>
          ) : null}

          {otherUnitDistricts.length ? (
            <>
              <div className={`${classes.areaTitle} ${classes.sidePadding}`}>
                <AreaIcon className={classes.rightPadding} />
                <Typography component="h3" className={classes.bold}>
                  <FormattedMessage id="area.services.nearby" />
                </Typography>
              </div>
              <List>
                {otherUnitDistricts.map(district => (
                  renderDistrictUnitItem(district)
                ))}
              </List>
            </>
          ) : null}
        </div>
      );
    }

    return (
      <div>
        <List>
          {selectedDistrictData.filter(obj => obj.unit).map(district => (
            renderDistrictUnitItem(district)
          ))}
        </List>
      </div>
    );
  };

  return render();
};

UnitTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitTab.defaultProps = {
};

export default UnitTab;
