import { List, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { DistrictItem } from '../../../../components';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import { selectCities } from '../../../../redux/selectors/settings';
import { filterByCitySettings } from '../../../../utils/filters';
import { sortByOriginID } from '../../utils';
import {
  StyledDistrictServiceList,
  StyledDivider,
  StyledServiceList,
  StyledServiceTabServiceList,
} from '../styled/styled';

export function DistrictAreaList({ selectedAddress = null, district }) {
  const intl = useIntl();
  const citySettings = useSelector(selectCities);
  const addressDistrict = useSelector(getAddressDistrict);
  let sectionText = intl.formatMessage({
    id: `area.services.all.${district.id}`,
  });

  const districtsWithoutUnits = district.data.filter(
    (d) =>
      !d.unit &&
      (d.type === 'rescue_area' ||
        d.type === 'rescue_district' ||
        d.type === 'rescue_sub_district')
  );

  if (!districtsWithoutUnits.length) {
    return null;
  }

  const filteredData = districtsWithoutUnits.filter(
    filterByCitySettings(citySettings)
  );

  if (!filteredData.length) {
    return null;
  }

  const renderServiceListAccordion = (title, districts) => (
    <StyledServiceTabServiceList>
      <Typography>{`${title} (${districts.length})`}</Typography>
      <List disablePadding>
        {districts.map((district) => (
          <DistrictItem
            key={district.id}
            area={district}
            title={false}
            paddedDivider
          />
        ))}
      </List>
    </StyledServiceTabServiceList>
  );

  sortByOriginID(filteredData);

  if (selectedAddress && addressDistrict) {
    sectionText = intl.formatMessage({
      id: `area.services.nearby.${district.id}`,
    });
    const localDistrict = filteredData.filter(
      (obj) => obj.id === addressDistrict.id
    );
    const otherDistricts = filteredData.filter(
      (obj) => obj.id !== addressDistrict.id
    );

    const localAreaDistricts = [...localDistrict];

    const otherAreaDistricts = [
      ...otherDistricts.filter(
        (district) => district.municipality === selectedAddress.municipality.id
      ),
    ];

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
                {localAreaDistricts.map((district) => (
                  <DistrictItem
                    key={district.id}
                    area={district}
                    title={false}
                    hideDivider
                  />
                ))}
              </List>
            </StyledServiceList>
            <StyledDivider aria-hidden />
          </>
        ) : null}

        {otherAreaDistricts.length
          ? renderServiceListAccordion(sectionText, otherAreaDistricts)
          : null}
      </div>
    );
  }

  return (
    <StyledDistrictServiceList>
      {renderServiceListAccordion(sectionText, filteredData)}
      <StyledDivider aria-hidden />
    </StyledDistrictServiceList>
  );
}

DistrictAreaList.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
};

export default DistrictAreaList;
