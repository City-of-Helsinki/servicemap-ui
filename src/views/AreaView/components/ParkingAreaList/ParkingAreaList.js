import styled from '@emotion/styled';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import {
  addSelectedParkingArea,
  fetchParkingAreaGeometry,
  fetchParkingUnits,
  removeSelectedParkingArea,
  setParkingUnits,
  setSelectedDistrictType,
} from '../../../../redux/actions/district';
import {
  selectParkingAreasMap,
  selectParkingUnitsMap,
  selectSelectedDistrictType,
  selectSelectedParkingAreaIds,
} from '../../../../redux/selectors/district';
import ServiceMapAPI from '../../../../utils/newFetch/ServiceMapAPI';
import {
  heavyTrafficNoParking,
  parkingHelsinkiTypes,
  parkingVantaaHeavyTrafficTypes,
  parkingVantaaTypes,
  passengerCarParkAndRide,
  resolveParamsForParkingFetch,
  resolveParkingAreaId,
  resolveParkingAreaName,
} from '../../../../utils/parking';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  getDistrictCategory,
  parkingUnitCategoryIds,
} from '../../utils/districtDataHelper';
import {
  StyledAreaListItem,
  StyledCheckBoxIcon,
  StyledListLevelThree,
} from '../styled/styled';

const constructInitialSelectedParkingUnits = (parkingUnitsMap) => {
  const selected = {};
  parkingUnitCategoryIds.forEach((parkingUnitCategoryId) => {
    selected[parkingUnitCategoryId] =
      !!parkingUnitsMap[parkingUnitCategoryId]?.length;
  });
  return selected;
};

function ParkingAreaList({ variant }) {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const parkingAreasMap = useSelector(selectParkingAreasMap);
  const parkingUnitsMap = useSelector(selectParkingUnitsMap);

  const [areaDataInfoMap, setAreaDataInfoMap] = useState({});
  const initialState = constructInitialSelectedParkingUnits(parkingUnitsMap);
  const [parkingUnitsSelectedMap, setParkingUnitsSelectedMap] =
    useState(initialState);

  const toggleParkingUnits = async (event, parkingUnitsId) => {
    const newValue = { ...parkingUnitsSelectedMap };
    if (event.target.checked) {
      newValue[parkingUnitsId] = true;
      setParkingUnitsSelectedMap(newValue);
      if (
        selectedDistrictType &&
        getDistrictCategory(selectedDistrictType !== 'parking')
      ) {
        dispatch(setSelectedDistrictType(null));
      }
      dispatch(fetchParkingUnits(parkingUnitsId));
    } else {
      newValue[parkingUnitsId] = false;
      setParkingUnitsSelectedMap(newValue);
      dispatch(setParkingUnits(parkingUnitsId, []));
    }
  };

  const handleParkingCheckboxChange = (id) => {
    if (
      !selectedParkingAreaIds.length &&
      getDistrictCategory(selectedDistrictType) !== 'parking'
    ) {
      dispatch(setSelectedDistrictType(null));
    }
    if (selectedParkingAreaIds.includes(id)) {
      dispatch(removeSelectedParkingArea(id));
    } else {
      dispatch(addSelectedParkingArea(id));
    }
    if (!parkingAreasMap[id]) {
      dispatch(fetchParkingAreaGeometry(id));
    }
  };

  function resolveTypesForVariant() {
    if (variant === 'helsinki') {
      return [...parkingHelsinkiTypes];
    }
    if (variant === 'vantaa/passenger_car') {
      return [...parkingVantaaTypes, passengerCarParkAndRide];
    }
    if (variant === 'vantaa/heavy_traffic') {
      return [...parkingVantaaHeavyTrafficTypes, heavyTrafficNoParking];
    }
    return [];
  }

  const fetchParkingData = async () => {
    // This fetches only 1 result from each parking space type to get category names for list
    const smAPI = new ServiceMapAPI();
    const promises = resolveTypesForVariant()
      .map((parkingType) => resolveParamsForParkingFetch(parkingType))
      .map(async (params) => smAPI.parkingAreaInfo(params));
    const parkingAreaObjects = await Promise.all(promises);
    setAreaDataInfoMap(
      parkingAreaObjects.flat().reduce(
        (acc, area) => ({
          ...acc,
          [resolveParkingAreaId(area)]: area,
        }),
        {}
      )
    );
  };

  useEffect(() => {
    if (!Object.keys(areaDataInfoMap).length) {
      fetchParkingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderAreaName(area) {
    const nameData = resolveParkingAreaName(area);
    if (nameData.type === 'TranslationKey') {
      return <FormattedMessage id={nameData.value} />;
    }
    if (nameData.type === 'LocalizedObject') {
      return getLocaleText(nameData.value);
    }
    return null;
  }

  const parkingUnitsSetting = {
    'helsinki-531': { labelKey: 'area.list.parkingGarages' },
    'vantaa-2204': { labelKey: 'area.list.sharedCarParking' },
    'vantaa-2207': { labelKey: 'area.list.accessibleStreetParking' },
  };

  function getStyledAreaListItem(parkingUnitsId) {
    const { labelKey } = parkingUnitsSetting[parkingUnitsId];
    const checked = parkingUnitsSelectedMap[parkingUnitsId];
    return (
      <StyledAreaListItem
        key={`parkingSpaces${parkingUnitsId}`}
        divider
        className="parkingSpaces"
      >
        <StyledFormControlLabel
          control={
            <Checkbox
              color="primary"
              icon={<StyledCheckBoxIcon />}
              checked={checked}
              onChange={(e) => toggleParkingUnits(e, parkingUnitsId)}
            />
          }
          label={
            <Typography id="parkingSpacesName" aria-hidden>
              <FormattedMessage id={labelKey} />
            </Typography>
          }
        />
      </StyledAreaListItem>
    );
  }

  const renderedParkingCategoryIds = (() => {
    if (variant === 'helsinki') {
      return parkingUnitCategoryIds.filter((id) => id.includes('helsinki'));
    }
    if (variant === 'vantaa/passenger_car') {
      return parkingUnitCategoryIds.filter((id) => id.includes('vantaa'));
    }
    return [];
  })();
  return (
    <StyledListLevelThree data-sm="ParkingList" disablePadding>
      {Object.entries(areaDataInfoMap).map(([key, area]) => {
        return (
          <Fragment key={key}>
            <StyledAreaListItem key={key} divider className={key}>
              <StyledFormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    icon={<StyledCheckBoxIcon />}
                    checked={selectedParkingAreaIds.includes(key)}
                    onChange={() => handleParkingCheckboxChange(key)}
                  />
                }
                label={
                  <Typography id={`${key}Name`} aria-hidden>
                    {renderAreaName(area)}
                  </Typography>
                }
              />
            </StyledAreaListItem>
          </Fragment>
        );
      })}

      {renderedParkingCategoryIds.map((parkingCategoryId) => (
        <Fragment key={parkingCategoryId}>
          {getStyledAreaListItem(parkingCategoryId)}
        </Fragment>
      ))}
    </StyledListLevelThree>
  );
}

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

ParkingAreaList.propTypes = {
  variant: PropTypes.oneOf([
    'helsinki',
    'vantaa/passenger_car',
    'vantaa/heavy_traffic',
  ]).isRequired,
};

export default ParkingAreaList;
