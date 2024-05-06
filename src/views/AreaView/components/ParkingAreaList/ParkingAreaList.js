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
  selectParkingAreas,
  selectParkingUnits,
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
import { getDistrictCategory } from '../../utils/districtDataHelper';
import { StyledAreaListItem, StyledCheckBoxIcon, StyledListLevelThree } from '../styled/styled';

const ParkingAreaList = ({ variant }) => {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const parkingAreas = useSelector(selectParkingAreas);
  const parkingUnits = useSelector(selectParkingUnits);

  const [areaDataInfo, setAreaDataInfo] = useState([]);
  const [unitsSelected, setUnitsSelected] = useState(!!parkingUnits.length);

  const toggleParkingUnits = async (event) => {
    if (event.target.checked) {
      setUnitsSelected(true);
      if (selectedDistrictType && getDistrictCategory(selectedDistrictType !== 'parking')) {
        dispatch(setSelectedDistrictType(null));
      }
      dispatch(fetchParkingUnits('531', 'helsinki'));
    } else {
      setUnitsSelected(false);
      dispatch(setParkingUnits([]));
    }
  };

  const handleParkingCheckboxChange = (id) => {
    if (!selectedParkingAreaIds.length && getDistrictCategory(selectedDistrictType) !== 'parking') {
      dispatch(setSelectedDistrictType(null));
    }
    if (selectedParkingAreaIds.includes(id)) {
      dispatch(removeSelectedParkingArea(id));
    } else {
      dispatch(addSelectedParkingArea(id));
    }
    if (!parkingAreas.some(obj => resolveParkingAreaId(obj) === id)) {
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
      .map(parkingType => resolveParamsForParkingFetch(parkingType))
      .map(async params => smAPI.parkingAreaInfo(params));
    const parkingAreaObjects = await Promise.all(promises);
    setAreaDataInfo(parkingAreaObjects.flat());
  };

  useEffect(() => {
    if (!areaDataInfo.length) {
      fetchParkingData();
    }
  }, []);

  useEffect(() => {
    if (parkingUnits.length) setUnitsSelected(true);
  }, [parkingUnits]);

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

  return (
    <StyledListLevelThree data-sm="ParkingList" disablePadding>
      {areaDataInfo.map((area) => {
        const fullId = resolveParkingAreaId(area);
        return (
          <Fragment key={fullId}>
            <StyledAreaListItem
              key={fullId}
              divider
              className={fullId}
            >
              <StyledFormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    icon={<StyledCheckBoxIcon />}
                    checked={selectedParkingAreaIds.includes(fullId)}
                    onChange={() => handleParkingCheckboxChange(fullId)}
                  />
                )}
                label={(
                  <Typography id={`${fullId}Name`} aria-hidden>
                    {renderAreaName(area)}
                  </Typography>
                )}
              />
            </StyledAreaListItem>
          </Fragment>
        );
      })}

      { variant === 'helsinki' && (
        <Fragment>
          <StyledAreaListItem
            key="parkingSpaces"
            divider
            className="parkingSpaces"
          >
            <StyledFormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  icon={<StyledCheckBoxIcon />}
                  checked={unitsSelected}
                  onChange={e => toggleParkingUnits(e)}
                />
              )}
              label={(
                <Typography id="parkingSpacesName" aria-hidden>
                  <FormattedMessage id="area.list.parkingUnits" />
                </Typography>
              )}
            />
          </StyledAreaListItem>
        </Fragment>
      )}
    </StyledListLevelThree>
  );
};

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

ParkingAreaList.propTypes = {
  variant: PropTypes.oneOf(['helsinki', 'vantaa/passenger_car', 'vantaa/heavy_traffic', 'vantaa/other']).isRequired,
};

export default ParkingAreaList;
