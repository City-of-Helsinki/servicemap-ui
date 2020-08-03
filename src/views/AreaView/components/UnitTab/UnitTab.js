import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider, ExpansionPanel, ExpansionPanelSummary,
} from '@material-ui/core';
import distance from '@turf/distance';
import { FormattedMessage } from 'react-intl';
import { ArrowDropDown } from '@material-ui/icons';
import { AreaIcon, AddressIcon } from '../../../../components/SMIcon';
import { formatDistanceObject, uppercaseFirst } from '../../../../utils';
import DivisionItem from '../../../../components/ListItems/DivisionItem';
import UnitItem from '../../../../components/ListItems/UnitItem';


const UnitTab = ({
  selectedDistrictData,
  selectedAddress,
  selectedSubdistrict,
  filteredSubdistrictUnits,
  addressDistrict,
  formAddressString,
  getLocaleText,
  classes,
  intl,
}) => {
  const sortDistricts = (districts) => {
    districts.sort((a, b) => a.unit.distance - b.unit.distance);
  };

  const sortUnitCategories = (categories) => {
    categories.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));
  };

  const distanceToAddress = coord => (
    Math.round(distance(coord, selectedAddress.location.coordinates) * 1000)
  );

  const renderDistrictUnitItem = district => (
    <DivisionItem
      key={district.id}
      className={classes.divisionItem}
      divider
      data={{
        area: district,
        name: district.unit.name || null,
        id: district.unit.id,
        street_address: district.unit.street_address,
      }}
      distance={district.unit.distance
        ? formatDistanceObject(intl, district.unit.distance)
        : null}
    />
  );

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
          serviceList.push({ id: category.id, units: [unit], name: category.name });
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
        <ExpansionPanel key={category.id} classes={{ expanded: classes.expandedUnitCategory }}>
          <ExpansionPanelSummary classes={{ content: classes.centerItems }}>
            <Typography className={classes.unitCategoryText}>{`${uppercaseFirst(getLocaleText(category.name))} (${category.units.length})`}</Typography>
            <ArrowDropDown className={classes.right} />
          </ExpansionPanelSummary>
          <List>
            {category.units.map((unit, i) => (
              <UnitItem
                key={unit.id}
                unit={unit}
                divider={i !== category.units.length - 1}
              />
            ))}
          </List>
        </ExpansionPanel>
      ))
    );
  };


  const render = () => {
    if (!selectedDistrictData.length) {
      return (
        <div>
          <Typography className={classes.infoText}>
            <FormattedMessage id="area.noSelection" />
          </Typography>
        </div>
      );
    }

    if (selectedSubdistrict) {
      // If geographical subdistrict is selected, lsit units within the district
      return (
        <div>
          <List>
            {selectedDistrictData.filter(obj => obj.unit).map(district => (
              renderDistrictUnitItem(district)
            ))}
            {selectedSubdistrict ? (
              <List>
                {renderUnitList()}
              </List>
            ) : null}
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
