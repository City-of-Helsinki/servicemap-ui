import React from 'react';
import PropTypes from 'prop-types';
import { List, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import { DistrictItem } from '../../../../components';
import { sortByOriginID } from '../../utils';
import {
  StyledDistrictServiceList,
  StyledDivider,
  StyledServiceList,
  StyledServiceTabServiceList,
} from '../styled/styled';

export const DistrictAreaList = ({ selectedAddress, district }) => {
  const intl = useIntl();
  const citySettings = useSelector(state => state.settings.cities);
  const addressDistrict = useSelector(state => getAddressDistrict(state));
  let sectionText = intl.formatMessage({ id: `area.services.all.${district.id}` });

  const districtsWithoutUnits = district.data.filter(d => (
    !d.unit
    && (
      d.type === 'rescue_area'
      || d.type === 'rescue_district'
      || d.type === 'rescue_sub_district'
    )
  ));

  if (!districtsWithoutUnits.length) {
    return null;
  }

  const selectedCities = Object.keys(citySettings).filter(city => citySettings[city]);
  let filteredData = [];
  if (!selectedCities.length) {
    filteredData = districtsWithoutUnits;
  } else {
    filteredData = districtsWithoutUnits.filter(d => (
      selectedCities.includes(d.municipality)
    ));
  }

  if (!filteredData.length) {
    return null;
  }

  const renderServiceListAccordion = (title, districts) => (
    <StyledServiceTabServiceList>
      <Typography>{`${title} (${districts.length})`}</Typography>
      <List disablePadding>
        {districts.map(district => (
          <DistrictItem key={district.id} area={district} title={false} paddedDivider />
        ))}
      </List>
    </StyledServiceTabServiceList>
  );

  sortByOriginID(filteredData);

  if (selectedAddress && addressDistrict) {
    sectionText = intl.formatMessage({ id: `area.services.nearby.${district.id}` });
    const localDistrict = filteredData.filter(obj => obj.id === addressDistrict.id);
    const otherDistricts = filteredData.filter(obj => obj.id !== addressDistrict.id);

    const localAreaDistricts = [];
    localDistrict.forEach((district) => {
      const newValue = district;
      localAreaDistricts.push(newValue);
    });
    const otherAreaDistricts = [];
    otherDistricts.forEach((district) => {
      if (district.municipality === selectedAddress.municipality.id) {
        const newValue = district;
        otherAreaDistricts.push(newValue);
      }
    });

    if (!localAreaDistricts.length && !otherAreaDistricts.length) {
      return null;
    }

    return (
      <div>
        {localAreaDistricts.length ? (
          <>
            <StyledServiceList>
              <Typography>
                <FormattedMessage id="area.services.local" />
              </Typography>
              <List disablePadding>
                {localAreaDistricts.map(district => (
                  <DistrictItem key={district.id} area={district} title={false} hideDivider />
                ))}
              </List>
            </StyledServiceList>
            <StyledDivider aria-hidden />
          </>
        ) : null}

        {otherAreaDistricts.length ? (
          renderServiceListAccordion(
            sectionText,
            otherAreaDistricts,
          )
        ) : null}
      </div>
    );
  }

  return (
    <StyledDistrictServiceList>
      {
        renderServiceListAccordion(
          sectionText,
          filteredData,
        )
      }
      <StyledDivider aria-hidden />
    </StyledDistrictServiceList>
  );
};

DistrictAreaList.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
};

DistrictAreaList.defaultProps = {
  selectedAddress: null,
};

export default DistrictAreaList;
