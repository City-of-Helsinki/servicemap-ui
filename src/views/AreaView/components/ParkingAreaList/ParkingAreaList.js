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
  parkingSpaceIDs,
  parkingSpaceVantaaTypes,
  removeSelectedParkingArea,
  setParkingUnits,
  setSelectedDistrictType,
} from '../../../../redux/actions/district';
import {
  selectParkingAreas,
  selectParkingUnits,
  selectSelectedDistrictType,
  selectSelectedParkingAreas,
} from '../../../../redux/selectors/district';
import ServiceMapAPI from '../../../../utils/newFetch/ServiceMapAPI';
import useLocaleText from '../../../../utils/useLocaleText';
import { getDistrictCategory } from '../../utils/districtDataHelper';
import { StyledAreaListItem, StyledCheckBoxIcon, StyledListLevelThree } from '../styled/styled';

const ParkingAreaList = ({ areas, variant }) => {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreas = useSelector(selectSelectedParkingAreas);
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
      dispatch(fetchParkingUnits());
    } else {
      setUnitsSelected(false);
      dispatch(setParkingUnits([]));
    }
  };

  const handleParkingCheckboxChange = (id) => {
    if (!selectedParkingAreas.length && getDistrictCategory(selectedDistrictType) !== 'parking') {
      dispatch(setSelectedDistrictType(null));
    }
    if (selectedParkingAreas.includes(id)) {
      dispatch(removeSelectedParkingArea(id));
    } else {
      dispatch(addSelectedParkingArea(id));
    }
    if (!parkingAreas.some(obj => obj.extra.class === id || obj.extra.tyyppi === id)) {
      dispatch(fetchParkingAreaGeometry(id));
    }
  };

  const fetchParkingData = async () => {
    // This fetches only 1 result from each parking space type to get category names for list
    const smAPI = new ServiceMapAPI();
    let promises = [];
    if (variant === 'helsinki') {
      promises = parkingSpaceIDs.map(
        async id => smAPI.parkingAreaInfo({ extra__class: id, municipality: 'helsinki' }),
      );
    }
    if (variant === 'vantaa') {
      promises = parkingSpaceVantaaTypes.map(
        async id => smAPI.parkingAreaInfo({ extra__tyyppi: id, municipality: 'vantaa' }),
      );
    }
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

  return (
    <StyledListLevelThree data-sm="ParkingList" disablePadding>
      {areaDataInfo.map((area, i) => {
        const fullId = variant === 'helsinki' ? area.extra.class : area.extra.tyyppi;
        return (
          <Fragment key={fullId}>
            <StyledAreaListItem
              key={fullId}
              divider={areas.length !== i + 1}
              className={`${fullId}`}
            >
              <StyledFormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    icon={<StyledCheckBoxIcon />}
                    checked={selectedParkingAreas.includes(fullId)}
                    onChange={() => handleParkingCheckboxChange(fullId)}
                  />
                )}
                label={(
                  <Typography id={`${fullId}Name`} aria-hidden>
                    {typeof area.name === 'object'
                      ? getLocaleText(area.name)
                      : <FormattedMessage id={`area.list.${area.name}`} />
                    }
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
                  <FormattedMessage id="area.list.parkingUnits"/>
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
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
  variant: PropTypes.string.isRequired,
};

export default ParkingAreaList;
