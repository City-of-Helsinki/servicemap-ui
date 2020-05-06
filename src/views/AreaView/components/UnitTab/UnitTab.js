import React from 'react';
import PropTypes from 'prop-types';
import { List, Typography, Divider } from '@material-ui/core';
import distance from '@turf/distance';
import { FormattedMessage } from 'react-intl';
import { AreaIcon, AddressIcon } from '../../../../components/SMIcon';
import { formatDistanceObject } from '../../../../utils';
import DivisionItem from '../../../../components/ListItems/DivisionItem';


const UnitTab = ({
  selectedDistrictData, selectedAddress, addressDistrict, formAddressString, classes, intl,
}) => {
  const sortDistricts = (districts) => {
    districts.sort((a, b) => a.unit.distance - b.unit.distance);
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


  const render = () => {
    if (!selectedDistrictData) {
      return (
        <div>
          <Typography className={classes.infoText}>
            <FormattedMessage id="area.noSelection" />
          </Typography>
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
          <Divider />

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
