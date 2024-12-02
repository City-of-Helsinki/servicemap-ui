import styled from '@emotion/styled';
import { Divider, List, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../../config';
import { SMAccordion } from '../../../../components';
import {
  fetchDistrictGeometry, fetchDistricts,
  handleOpenItems,
  setParkingUnits,
  setSelectedDistrictType,
  setSelectedParkingAreas,
} from '../../../../redux/actions/district';
import {
  selectDistrictData,
  selectDistrictsFetching,
  selectParkingUnitsMap,
  selectSelectedDistrictType,
  selectSelectedParkingAreaIds,
} from '../../../../redux/selectors/district';
import { selectCities } from '../../../../redux/selectors/settings';
import { dataStructure, getDistrictCategory, parkingUnitCategoryIds } from '../../utils/districtDataHelper';
import DistrictAreaList from '../DistrictAreaList';
import DistrictToggleButton from '../DistrictToggleButton';
import DistrictUnitList from '../DistrictUnitList';
import ParkingAreaList from '../ParkingAreaList';
import {
  StyledAreaListItem,
  StyledBoldText,
  StyledCaptionText,
  StyledListItem,
  StyledListLevelThree, StyledLoadingText,
} from '../styled/styled';

const ServiceTab = (props) => {
  const {
    selectedAddress = null,
    initialOpenItems = [],
  } = props;
  const dispatch = useDispatch();
  const districtData = useSelector(selectDistrictData);
  const districtsFetching = useSelector(selectDistrictsFetching);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const selectedParkingAreaIds = useSelector(selectSelectedParkingAreaIds);
  const parkingUnits = useSelector(selectParkingUnitsMap);
  const citySettings = useSelector(selectCities);
  const selectedCategory = dataStructure.find(
    data => data.districts.some(obj => obj.id === selectedDistrictType),
  )?.id;

  const handleRadioChange = (district) => {
    if (selectedDistrictType === district.id) {
      dispatch(setSelectedDistrictType(null));
    } else {
      if (getDistrictCategory(district.name) !== 'parking') {
        if (selectedParkingAreaIds.length) {
          dispatch(setSelectedParkingAreas([]));
        }
        if (parkingUnits.length) {
          parkingUnitCategoryIds.forEach(id => {
            dispatch(setParkingUnits(id, []));
          });
        }
      }
      if (!district.data.some(obj => obj.boundary)) {
        dispatch(fetchDistrictGeometry(district.name, district.period));
      }
      dispatch(setSelectedDistrictType(district.id));
    }
  };

  useEffect(() => {
    if (!districtData.length) { // Arriving to page first time
      dispatch(fetchDistricts());
    }
  }, []);

  const renderDistrictItem = district => (
    <DistrictToggleButton
      district={district}
      selectionSize={districtData.length}
      onToggle={() => handleRadioChange(district)}
      selected={selectedDistrictType === district.id}
      label={(
        <>
          <Typography id={`${district.id}Name`} aria-hidden>
            <FormattedMessage id={`area.list.${district.name}`} />
          </Typography>
          {district.period && (
            <StyledCaptionText id={`${district.id}Period`} aria-hidden variant="caption">
              {district.period}
            </StyledCaptionText>
          )}
        </>
      )}
    />
  );


  const renderDistrictList = (districtList) => {
    const listDistrictAreas = ['rescue_area', 'rescue_district', 'rescue_sub_district'].includes(selectedDistrictType);
    const DistrictList = listDistrictAreas ? DistrictAreaList : DistrictUnitList;
    return (
      <StyledListLevelThree data-sm="DistrictList" disablePadding>
        {districtList.map(district => (
          <Fragment key={district.id}>
            <StyledAreaListItem
              key={district.id}
              className={`${district.id}`}
            >
              {renderDistrictItem(district)}
            </StyledAreaListItem>

            {/* Service list */}
            {selectedDistrictType === district.id && (
              <li>
                <DistrictList
                  district={district}
                  selectedAddress={selectedAddress}
                />
              </li>
            )}
          </Fragment>
        ))}
      </StyledListLevelThree>
    );
  };

  const renderParkingAreaSelection = (item) => { // Custom implementation for parking areas
    const districtList = districtData.filter(obj => item.districts.some(
      district => obj.id.includes(district.id),
    ));
    const parkingAreas = districtList.filter(obj => !obj.id.includes('parking_area'));
    const elementsHelsinki = (
      <>
        <StyledServiceTabSubtitle>
          <StyledBoldText component="h4"><FormattedMessage id="settings.city.helsinki" /></StyledBoldText>
        </StyledServiceTabSubtitle>
        <StyledServiceTabSubtitle>
          <Typography component="h6"><FormattedMessage id="area.list.parkingSpaces" /></Typography>
        </StyledServiceTabSubtitle>
        <ParkingAreaList variant="helsinki" />
      </>
    );
    const elementsVantaa = (
      <>
        <StyledServiceTabSubtitle>
          <StyledBoldText component="h4"><FormattedMessage id="settings.city.vantaa" /></StyledBoldText>
        </StyledServiceTabSubtitle>
        <StyledServiceTabSubtitle>
          <Typography component="h6"><FormattedMessage id="area.list.passenger_car" /></Typography>
        </StyledServiceTabSubtitle>
        <ParkingAreaList variant="vantaa/passenger_car" />
        <StyledServiceTabSubtitle>
          <Typography component="h6"><FormattedMessage id="area.list.heavy_traffic" /></Typography>
        </StyledServiceTabSubtitle>
        <ParkingAreaList variant="vantaa/heavy_traffic" />
      </>
    );

    const everyCity = config.cities.every(city => !citySettings[city]);
    const showHelsinki = everyCity || citySettings.helsinki;
    const showVantaa = everyCity || citySettings.vantaa;
    return (
      <>
        {renderDistrictList(parkingAreas)}
        {showHelsinki ? elementsHelsinki : null}
        {showVantaa ? elementsVantaa : null}
      </>
    );
  };


  const renderCollapseContent = (item) => {
    if (item.id === 'parking') {
      return renderParkingAreaSelection(item);
    }
    if (item.subCategories) {
      return item.subCategories.map((obj) => {
        const districList = districtData.filter(i => obj.districts.includes(i.name));
        return (
          <React.Fragment key={obj.titleID}>
            <StyledServiceTabSubtitle>
              <Typography><FormattedMessage id={obj.titleID} /></Typography>
            </StyledServiceTabSubtitle>
            {renderDistrictList(districList)}
          </React.Fragment>
        );
      });
    }

    const districList = districtData.filter(
      i => item.districts.some(district => district.id === i.name),
    );
    return renderDistrictList(districList);
  };


  const renderCategoryItem = (item) => {
    const defaultExpanded = initialOpenItems.includes(item.id) || selectedCategory === item.id;
    const ariaHidden = item.id === 'parking';
    return (
      <StyledListItem aria-hidden={ariaHidden} key={item.titleID} divider>
        <StyledStyledAccordion
          onOpen={() => dispatch(handleOpenItems(item.id))}
          defaultOpen={defaultExpanded}
          titleContent={<StyledBoldText id={`${item.id}-content`}><FormattedMessage id={item.titleID} /></StyledBoldText>}
          collapseContent={(
            <>
              <Divider aria-hidden />
              <StyledCollapseAreaContainer>
                {renderCollapseContent(item)}
              </StyledCollapseAreaContainer>
            </>
          )}
        />
      </StyledListItem>
    );
  };

  const districtCategoryList = dataStructure.filter(obj => obj.id !== 'geographical');

  if (!districtData.length && districtsFetching?.length) {
    return (
      <StyledLoadingText data-sm="ServiceTabComponent">
        <Typography aria-hidden>
          <FormattedMessage id="general.loading" />
        </Typography>
      </StyledLoadingText>
    );
  }

  return (
    <div data-sm="ServiceTabComponent">
      <Typography style={visuallyHidden} component="h3">
        <FormattedMessage id="area.list" />
      </Typography>
      <StyledListLevelTwo>
        {districtCategoryList.map(item => renderCategoryItem(item))}
      </StyledListLevelTwo>
    </div>
  );
};

const StyledServiceTabSubtitle = styled('div')(({ theme }) => ({
  height: 48,
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(9),
}));

const StyledStyledAccordion = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(9),
}));

const StyledCollapseAreaContainer = styled('div')(() => ({
  backgroundColor: 'rgba(222, 222, 222, 0.12)',
}));

const StyledListLevelTwo = styled(List)(() => ({
  backgroundColor: 'rgb(250,250,250)',
  '& > li:last-of-type': {
    borderBottom: 'none',
  },
}));

ServiceTab.propTypes = {
  initialOpenItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  selectedAddress: PropTypes.objectOf(PropTypes.any),
};

export default React.memo(ServiceTab);
