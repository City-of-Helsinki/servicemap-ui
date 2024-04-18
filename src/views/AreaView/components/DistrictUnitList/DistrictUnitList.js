import { List, Typography } from '@mui/material';
import distance from '@turf/distance';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { DivisionItem } from '../../../../components';
import { getAddressDistrict, selectDistrictsFetching } from '../../../../redux/selectors/district';
import { selectCities } from '../../../../redux/selectors/settings';
import { getLocale } from '../../../../redux/selectors/user';
import { formatDistanceObject } from '../../../../utils';
import { getAddressFromUnit } from '../../../../utils/address';
import { filterByCitySettings } from '../../../../utils/filters';
import { orderUnits } from '../../../../utils/orderUnits';
import useLocaleText from '../../../../utils/useLocaleText';
import { sortByOriginID } from '../../utils';
import {
  StyledDistrictServiceListLevelFour,
  StyledDivider,
  StyledLoadingText,
  StyledServiceList,
  StyledServiceTabServiceList,
} from '../styled/styled';

const DistrictUnitList = (props) => {
  const {
    intl, selectedAddress, district,
  } = props;

  const citySettings = useSelector(selectCities);
  const addressDistrict = useSelector(getAddressDistrict);
  const districtsFetching = useSelector(selectDistrictsFetching);
  const locale = useSelector(getLocale);
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
    <StyledServiceTabServiceList>
      <Typography data-sm="DistrictUnitsTitle">{`${title} (${unitList.length})`}</Typography>
      <List data-sm="DistrictUnits" disablePadding>
        {unitList.map(unit => renderDistrictUnitItem(unit))}
      </List>
    </StyledServiceTabServiceList>
  );


  const render = () => {
    if (districtsFetching.length) {
      return (
        <StyledLoadingText>
          <Typography aria-hidden>
            <FormattedMessage id="general.loading" />
          </Typography>
        </StyledLoadingText>
      );
    }

    const cityFilteredDistricts = district.data.filter(filterByCitySettings(citySettings));

    if (district.id === 'rescue_area') {
      sortByOriginID(cityFilteredDistricts);
    }

    let unitList = [];
    cityFilteredDistricts.forEach((obj) => {
      let localArea = false;
      if (selectedAddress && addressDistrict?.id === obj.id) {
        localArea = true;
      }
      if (obj.units?.length) {
        obj.units
          .filter(unit => typeof unit === 'object')
          .forEach((unit) => {
            unit.localUnit = localArea;
          });
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

    // Filter out non unit objects
    unitList = unitList.filter(u => typeof u === 'object' && typeof u.id === 'number');
    unitList = orderUnits(unitList, { locale, direction: 'desc', order: 'alphabetical' })

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
              <StyledServiceList>
                <Typography>
                  <FormattedMessage id="area.services.local" />
                </Typography>
                <List disablePadding>
                  {localUnits.map(unit => renderDistrictUnitItem(unit))}
                </List>
              </StyledServiceList>
              <StyledDivider aria-hidden />
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
    if (!unitList.length) {
      return null;
    }

    return (
      renderServiceListAccordion(
        intl.formatMessage({ id: 'area.services.all' }),
        unitList,
      )
    );
  };

  return (
    <StyledDistrictServiceListLevelFour>
      {render()}
      <StyledDivider aria-hidden />
    </StyledDistrictServiceListLevelFour>
  );
};

DistrictUnitList.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

DistrictUnitList.defaultProps = {
  selectedAddress: null,
};

export default React.memo(DistrictUnitList);
