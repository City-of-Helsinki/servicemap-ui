import {
  Checkbox, FormControlLabel, List, ListItem, Typography,
} from '@mui/material';
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
import ServiceMapAPI from '../../../../utils/newFetch/ServiceMapAPI';
import useLocaleText from '../../../../utils/useLocaleText';
import { getDistrictCategory } from '../../utils/districtDataHelper';

const parkingSpaceIDs = ['1', '2', '3', '4', '5', '6'];

const ParkingAreaList = ({ areas, classes }) => {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const selectedParkingAreas = useSelector(state => state.districts.selectedParkingAreas);
  const parkingAreas = useSelector(state => state.districts.parkingAreas);
  const parkingUnits = useSelector(state => state.districts.parkingUnits);

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
    if (!parkingAreas.some(obj => obj.extra.class === id)) {
      dispatch(fetchParkingAreaGeometry(id));
    }
  };

  const fetchParkingData = async () => {
    // This fetches only 1 result from each parking space type to get category names for list
    const smAPI = new ServiceMapAPI();
    const parkingAreaObjects = await Promise.all(
      parkingSpaceIDs.map(async id => smAPI.parkingAreaInfo(id)),
    );
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
    <List className="districtList" disablePadding>
      {areaDataInfo.map((area, i) => {
        const fullId = area.extra.class;
        return (
          <Fragment key={fullId}>
            <ListItem
              key={fullId}
              divider={areas.length !== i + 1}
              className={`${classes.listItem} ${classes.areaItem} ${fullId}`}
            >
              <FormControlLabel
                className={classes.checkboxPadding}
                control={(
                  <Checkbox
                    color="primary"
                    icon={<span className={classes.checkBoxIcon} />}
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
            </ListItem>
          </Fragment>
        );
      })}

      <Fragment>
        <ListItem
          key="parkingSpaces"
          divider
          className={`${classes.listItem} ${classes.areaItem} parkingSpaces`}
        >
          <FormControlLabel
            className={classes.checkboxPadding}
            control={(
              <Checkbox
                color="primary"
                icon={<span className={classes.checkBoxIcon} />}
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
        </ListItem>
      </Fragment>
    </List>
  );
};

ParkingAreaList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ParkingAreaList;
