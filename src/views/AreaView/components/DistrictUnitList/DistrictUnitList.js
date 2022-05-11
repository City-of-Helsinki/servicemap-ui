import React from 'react';
import PropTypes from 'prop-types';
import distance from '@turf/distance';
import { useSelector } from 'react-redux';
import { Divider, List, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { formatDistanceObject } from '../../../../utils';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import { getAddressFromUnit } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import { sortByOriginID } from '../../utils';
import { DivisionItem, SMAccordion } from '../../../../components';

const DistrictUnitList = (props) => {
  const {
    classes, intl, selectedAddress, district,
  } = props;

  const citySettings = useSelector(state => state.settings.cities);
  const addressDistrict = useSelector(state => getAddressDistrict(state));
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const getLocaleText = useLocaleText();

  const sortDistricts = (units) => {
    units.sort((a, b) => a.distance - b.distance);
  };

  const distanceToAddress = (coord) => {
    if (coord && selectedAddress) {
      return Math.round(distance(coord, selectedAddress.location.coordinates) * 1000);
    }
    return null;
  };


  const renderDistrictUnitItem = (unit) => {
    const streetAddress = getAddressFromUnit(unit, getLocaleText, intl);
    return (
      <DivisionItem
        key={unit.id}
        divider={false}
        disableTitle
        data={{
          area: district,
          name: unit.name || null,
          id: unit.id,
          street_address: streetAddress,
        }}
        distance={unit.distance
          ? formatDistanceObject(intl, unit.distance)
          : null}
      />
    );
  };


  const renderServiceListAccordion = (title, unitList) => (
    <SMAccordion
      className={classes.serviceListAccordion}
      defaultOpen
      titleContent={<Typography>{`${title} (${unitList.length})`}</Typography>}
      disabled={!unitList.length}
      collapseContent={(
        <List className={`${classes.serviceListPadding} districtUnits`} disablePadding>
          {unitList.map(unit => renderDistrictUnitItem(unit))}
        </List>
      )}
    />
  );


  const render = () => {
    if (districtsFetching.length) {
      return (
        <div className={classes.loadingText}>
          <Typography aria-hidden>
            <FormattedMessage id="general.loading" />
          </Typography>
        </div>
      );
    }


    const selectedCities = Object.values(citySettings).filter(city => city);
    const cityFilteredDistricts = !selectedCities.length
      ? district.data
      : district.data.filter(obj => citySettings[obj.municipality]);

    if (district.id === 'rescue_area') {
      sortByOriginID(cityFilteredDistricts);
    }

    const unitList = [];
    cityFilteredDistricts.forEach((obj) => {
      let localArea = false;
      if (selectedAddress && addressDistrict?.id === obj.id) {
        localArea = true;
      }
      if (obj.units?.length) {
        obj.units.forEach((unit) => { unit.localUnit = localArea; });
        unitList.push(...obj.units);
      } else if (obj.unit) {
        obj.unit.localUnit = localArea;
        unitList.push(obj.unit);
      }
      if (obj.overlapping) {
        obj.overlapping.forEach((i) => {
          if (i.unit) {
            i.unit.localUnit = localArea;
            unitList.push(i.unit);
          }
        });
      }
    });

    if (selectedAddress && addressDistrict) {
      unitList.forEach((unit) => {
        unit.distance = distanceToAddress(unit.location?.coordinates);
      });

      const localUnits = unitList.filter(unit => unit.localUnit);
      const otherUnits = unitList.filter(unit => !unit.localUnit);

      if (!localUnits.length && !otherUnits.length) {
        return null;
      }

      if (district.id !== 'rescue_area') {
        sortDistricts(localUnits);
        sortDistricts(otherUnits);
      }

      return (
        <div>
          {localUnits.length ? (
            <>
              <div className={classes.servciceList}>
                <Typography>
                  <FormattedMessage id="area.services.local" />
                </Typography>
                <List disablePadding>
                  {localUnits.map(unit => renderDistrictUnitItem(unit))}
                </List>
              </div>
              <Divider className={classes.serviceDivider} aria-hidden />
            </>
          ) : null}

          {otherUnits.length ? (
            renderServiceListAccordion(
              intl.formatMessage({ id: 'area.services.nearby' }),
              otherUnits,
            )
          ) : null}
        </div>
      );
    }

    return (
      renderServiceListAccordion(
        intl.formatMessage({ id: 'area.services.all' }),
        unitList,
      )
    );
  };

  return (
    <div className={classes.districtServiceList}>
      {render()}
      <Divider aria-hidden className={classes.serviceDivider} />
    </div>
  );
};

DistrictUnitList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

DistrictUnitList.defaultProps = {
  selectedAddress: null,
};

export default React.memo(DistrictUnitList);
