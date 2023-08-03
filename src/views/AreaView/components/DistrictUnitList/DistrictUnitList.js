import React from 'react';
import PropTypes from 'prop-types';
import distance from '@turf/distance';
import { useSelector } from 'react-redux';
import { List, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';
import { formatDistanceObject } from '../../../../utils';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import { getAddressFromUnit } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import { sortByOriginID } from '../../utils';
import { DivisionItem } from '../../../../components';
import {
  StyledDistrictServiceList,
  StyledDivider,
  StyledServiceList,
  StyledServiceTabServiceList,
} from '../styled/styled';

const DistrictUnitList = (props) => {
  const {
    intl, selectedAddress, district,
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
    <StyledServiceTabServiceList>
      <Typography>{`${title} (${unitList.length})`}</Typography>
      <List className="districtUnits" disablePadding>
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


    const selectedCities = Object.values(citySettings).filter(city => city);
    const cityFilteredDistricts = !selectedCities.length
      ? district.data
      : district.data.filter(obj => citySettings[obj.municipality]);

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

    return (
      renderServiceListAccordion(
        intl.formatMessage({ id: 'area.services.all' }),
        unitList,
      )
    );
  };

  return (
    <StyledDistrictServiceList>
      {render()}
      <StyledDivider aria-hidden />
    </StyledDistrictServiceList>
  );
};

const StyledLoadingText = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
}));

DistrictUnitList.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

DistrictUnitList.defaultProps = {
  selectedAddress: null,
};

export default React.memo(DistrictUnitList);
