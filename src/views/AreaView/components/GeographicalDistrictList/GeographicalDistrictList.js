import {
  Checkbox, List, ListItem, Typography,
} from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDistrictServices, setSelectedSubdistricts } from '../../../../redux/actions/district';
import { getDistrictsByType } from '../../../../redux/selectors/district';
import { panViewToBounds } from '../../../MapView/utils/mapActions';


const GeographicalDistrictList = ({
  district, getLocaleText, classes,
}) => {
  const dispatch = useDispatch();
  const map = useSelector(state => state.mapRef);
  const citySettings = useSelector(state => state.settings.cities);
  const selectedSubdistricts = useSelector(state => state.districts.selectedSubdistricts);
  const selectedDistrictData = useSelector(state => getDistrictsByType(state));


  const handleCheckboxChange = (event, district) => {
    let newArray;
    if (event.target.checked) {
      newArray = [...selectedSubdistricts, district.ocd_id];
      // Focus to selected districts
      const districtsToFocus = selectedDistrictData.filter(
        district => newArray.includes(district.ocd_id),
      );
      const coordinateArray = districtsToFocus.map(district => district.boundary.coordinates);
      panViewToBounds(map, district.boundary, coordinateArray);
    } else {
      newArray = selectedSubdistricts.filter(i => i !== district.ocd_id);
    }
    if (newArray === []) {
      dispatch(setSelectedDistrictServices([]));
    }
    dispatch(setSelectedSubdistricts(newArray));
  };


  const districList = district.data;
  districList.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));

  const groupedData = districList.reduce((acc, cur) => {
    const duplicate = acc.find(list => list[0].municipality === cur.municipality);
    if (duplicate) {
      duplicate.push(cur);
    } else {
      acc.push([cur]);
    }
    return acc;
  }, []);

  // Filter data with city settings
  const selectedCities = Object.values(citySettings).filter(city => city);
  let cityFilteredData = [];
  if (!selectedCities.length) {
    cityFilteredData = groupedData;
  } else {
    cityFilteredData = groupedData.filter(data => citySettings[data[0].municipality]);
  }

  // Reorder data order by municipality
  const citiesInOrder = Object.keys(citySettings);
  cityFilteredData.sort(
    (a, b) => citiesInOrder.indexOf(a[0].municipality) - citiesInOrder.indexOf(b[0].municipality),
  );

  return (
    cityFilteredData.map((data) => {
      const { municipality } = data[0];
      return (
        <React.Fragment key={municipality}>
          <div className={classes.municipalitySubtitle}>
            <Typography component="h4" className={classes.bold}>
              <FormattedMessage id={`settings.city.${municipality}`} />
            </Typography>
          </div>
          <List disablePadding>
            {data.map(district => (
              <ListItem className={`${classes.listItem} ${classes.areaItem}`} key={district.id} divider>
                <Checkbox
                  color="primary"
                  icon={<span className={classes.checkBoxIcon} />}
                  onChange={e => handleCheckboxChange(e, district)}
                  checked={selectedSubdistricts.includes(district.ocd_id)}
                />
                <Typography>{district.name.fi}</Typography>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      );
    }));
};

export default React.memo(GeographicalDistrictList);
