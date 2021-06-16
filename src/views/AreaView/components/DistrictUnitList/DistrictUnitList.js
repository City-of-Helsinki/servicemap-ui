import React from 'react';
import PropTypes from 'prop-types';
import distance from '@turf/distance';
import { useSelector } from 'react-redux';
import { Divider, List, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { formatDistanceObject } from '../../../../utils';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import DivisionItem from '../../../../components/ListItems/DivisionItem';
import { getAddressFromUnit } from '../../../../utils/address';
import SMAccordion from '../../../../components/SMAccordion';
import useLocaleText from '../../../../utils/useLocaleText';

const DistrictUnitList = (props) => {
  const {
    classes, intl, selectedAddress, district,
  } = props;

  const citySettings = useSelector(state => state.settings.cities);
  const addressDistrict = useSelector(state => getAddressDistrict(state));
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const getLocaleText = useLocaleText();

  const sortDistricts = (districts) => {
    districts.sort((a, b) => a.unit.distance - b.unit.distance);
  };

  const distanceToAddress = (coord) => {
    if (coord && selectedAddress) {
      return Math.round(distance(coord, selectedAddress.location.coordinates) * 1000);
    }
    return null;
  };


  const renderDistrictUnitItem = (district) => {
    const { unit } = district;
    let title;
    if (district.type === 'rescue_area') {
      title = `${intl.formatMessage({ id: `area.list.${district.type}` })} ${district.origin_id} ${getLocaleText(district.name)}`;
    }
    const streetAddress = getAddressFromUnit(unit, getLocaleText, intl);
    return (
      <DivisionItem
        key={district.id}
        divider={false}
        disableTitle={!title}
        customTitle={title}
        className={classes.divisionItem}
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

  const renderServiceListAccordion = (title, districts) => (
    <SMAccordion
      className={classes.serviceListAccordion}
      defaultOpen
      titleContent={<Typography>{`${title} (${districts.length})`}</Typography>}
      disabled={!districts.length}
      collapseContent={(
        <List className={classes.serviceListPadding} disablePadding>
          {districts.map(district => (
            renderDistrictUnitItem(district)
          ))}
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
    const districtsWithUnits = [];
    district.data.forEach((obj) => {
      if (obj.unit) {
        districtsWithUnits.push(obj);
      }
      if (obj.overlapping) {
        obj.overlapping.forEach((i) => {
          if (i.unit) {
            districtsWithUnits.push(i);
          }
        });
      }
    });

    if (!districtsWithUnits.length) return null;

    const selectedCities = Object.values(citySettings).filter(city => city);
    let cityFilteredUnits = [];
    if (!selectedCities.length) {
      cityFilteredUnits = districtsWithUnits;
    } else {
      cityFilteredUnits = districtsWithUnits.filter(unit => citySettings[unit.municipality]);
    }

    if (selectedAddress && addressDistrict) {
      const localDistrict = cityFilteredUnits.filter(obj => obj.id === addressDistrict.id);
      const otherDistricts = cityFilteredUnits.filter(obj => obj.id !== addressDistrict.id);

      const localUnitDistricts = [];
      localDistrict.forEach((district) => {
        const newValue = district;
        newValue.unit.distance = distanceToAddress(district.unit.location?.coordinates);
        localUnitDistricts.push(newValue);

        if (district.overlapping) {
          district.overlapping.forEach((obj) => {
            if (obj.unit) {
              const newValue = obj;
              newValue.unit.distance = distanceToAddress(obj.unit.location?.coordinates);
              localUnitDistricts.push(newValue);
            }
          });
        }
      });
      const otherUnitDistricts = [];
      otherDistricts.forEach((district) => {
        if (district.municipality === selectedAddress.street.municipality) {
          const newValue = district;
          newValue.unit.distance = distanceToAddress(district.unit.location?.coordinates);
          otherUnitDistricts.push(newValue);
          if (district.overlapping) {
            district.overlapping.forEach((obj) => {
              if (obj.unit) {
                const newValue = obj;
                newValue.unit.distance = distanceToAddress(obj.unit.location?.coordinates);
                otherUnitDistricts.push(newValue);
              }
            });
          }
        }
      });

      if (!localUnitDistricts.length && !otherUnitDistricts.length) {
        return null;
      }

      sortDistricts(localUnitDistricts);
      sortDistricts(otherUnitDistricts);

      return (
        <div>
          {localUnitDistricts.length ? (
            <>
              <div className={classes.servciceList}>
                <Typography>
                  <FormattedMessage id="area.services.local" />
                </Typography>
                <List disablePadding>
                  {localUnitDistricts.map(district => (
                    renderDistrictUnitItem(district)
                  ))}
                </List>
              </div>
              <Divider className={classes.serviceDivider} aria-hidden />
            </>
          ) : null}

          {otherUnitDistricts.length ? (
            renderServiceListAccordion(
              intl.formatMessage({ id: 'area.services.nearby' }),
              otherUnitDistricts,
            )
          ) : null}
        </div>
      );
    }

    return (
      renderServiceListAccordion(
        intl.formatMessage({ id: 'area.services.all' }),
        cityFilteredUnits,
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
