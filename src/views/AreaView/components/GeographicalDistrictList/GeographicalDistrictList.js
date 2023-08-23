import styled from '@emotion/styled';
import {
  Checkbox, FormControlLabel, List, ListItem, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SMAccordion } from '../../../../components';
import {
  setSelectedDistrictServices, setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import { getDistrictsByType } from '../../../../redux/selectors/district';
import useLocaleText from '../../../../utils/useLocaleText';
import { panViewToBounds } from '../../../MapView/utils/mapActions';
import { StyledBoldText, StyledCheckBoxIcon } from '../styled/styled';

const GeographicalDistrictList = ({ district }) => {
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
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
      if (districtsToFocus.length === 1) {
        map.fitBounds(coordinateArray[0]);
      } else {
        panViewToBounds(map, district.boundary, coordinateArray);
      }
    } else {
      newArray = selectedSubdistricts.filter(i => i !== district.ocd_id);
    }
    if (newArray.length === 0) {
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
    <>
      <StyledMunicipalitySubtitleContainer>
        <StyledBoldText component="h4">
          <FormattedMessage id={`area.${district.name}.title`} />
        </StyledBoldText>
        {
          cityFilteredData.length === 0
          && (
            <Typography variant="body2"><FormattedMessage id="area.city.selection.empty" /></Typography>
          )
        }
      </StyledMunicipalitySubtitleContainer>
      {cityFilteredData.map((data) => {
        const { municipality } = data[0];
        return (
          <React.Fragment key={municipality}>
            <SMAccordion // Unit list accordion
              defaultOpen={false}
              titleContent={(
                <StyledMunicipalityTitleContainer>
                  <StyledBoldText component="h6">
                    <FormattedMessage id={`settings.city.${municipality}`} />
                  </StyledBoldText>
                </StyledMunicipalityTitleContainer>
              )}
              collapseContent={(
                <List disablePadding>
                  {data.map(district => (
                    <StyledAreaItem key={district.id} divider>
                      <StyledFormControlLabel
                        control={(
                          <Checkbox
                            color="primary"
                            icon={<StyledCheckBoxIcon />}
                            onChange={e => handleCheckboxChange(e, district)}
                            checked={selectedSubdistricts.includes(district.ocd_id)}
                          />
                        )}
                        label={<Typography>{getLocaleText(district.name)}</Typography>}
                      />
                    </StyledAreaItem>
                  ))}
                </List>
              )}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

const StyledBaseContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  boxSizing: 'border-box',
}));

const StyledMunicipalitySubtitleContainer = styled(StyledBaseContainer)(({ theme }) => ({
  paddingLeft: theme.spacing(9),
}));

const StyledMunicipalityTitleContainer = styled(StyledBaseContainer)(({ theme }) => ({
  paddingLeft: theme.spacing(7),
}));

const StyledAreaItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  minHeight: theme.spacing(7),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(2),
}));
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

GeographicalDistrictList.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(GeographicalDistrictList);
