import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  Typography,
  Divider,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDistrictGeometry,
  handleOpenItems,
  setParkingUnits,
  setSelectedDistrictType,
  setSelectedParkingAreas,
} from '../../../../redux/actions/district';
import DistrictUnitList from '../DistrictUnitList';
import DistrictToggleButton from '../DistrictToggleButton';
import { dataStructure, getDistrictCategory } from '../../utils/districtDataHelper';
import DistrictAreaList from '../DistrictAreaList';
import ParkingAreaList from '../ParkingAreaList';
import {
  SMAccordion,
} from '../../../../components';

const ServiceTab = (props) => {
  const {
    selectedAddress,
    districtData,
    initialOpenItems,
    classes,
  } = props;
  const dispatch = useDispatch();
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const selectedParkingAreas = useSelector(state => state.districts.selectedParkingAreas);
  const parkingUnits = useSelector(state => state.districts.parkingUnits);
  const citySettings = useSelector(state => state.settings.cities);
  const selectedCategory = dataStructure.find(
    data => data.districts.some(obj => obj.id === selectedDistrictType),
  )?.id;

  const handleRadioChange = (district) => {
    if (selectedDistrictType === district.id) {
      dispatch(setSelectedDistrictType(null));
    } else {
      if (getDistrictCategory(district.name) !== 'parking') {
        if (selectedParkingAreas.length) {
          dispatch(setSelectedParkingAreas([]));
        }
        if (parkingUnits.length) {
          dispatch(setParkingUnits([]));
        }
      }
      if (!district.data.some(obj => obj.boundary)) {
        dispatch(fetchDistrictGeometry(district.name, district.period));
      }
      dispatch(setSelectedDistrictType(district.id));
    }
  };


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
            <Typography id={`${district.id}Period`} aria-hidden className={classes.captionText} variant="caption">
              {district.period}
            </Typography>
          )}
        </>
      )}
    />
  );


  const renderDistrictList = (districList) => {
    const listDistrictAreas = ['rescue_area', 'rescue_district', 'rescue_sub_district'].includes(selectedDistrictType);
    const DistrictList = listDistrictAreas ? DistrictAreaList : DistrictUnitList;
    return (
      <List className={`districtList ${classes.listLevelThree}`} disablePadding>
        {districList.map(district => (
          <Fragment key={district.id}>
            <ListItem
              key={district.id}
              className={`${classes.listItem} ${classes.areaItem} ${district.id}`}
            >
              {renderDistrictItem(district)}
            </ListItem>

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
      </List>
    );
  };


  const renderParkingAreaSelection = (item) => { // Custom implementation for parking areas
    const districList = districtData.filter(obj => item.districts.some(
      district => obj.id.includes(district.id),
    ));
    const parkingAreas = districList.filter(obj => !obj.id.includes('parking_area'));
    const parkingSpaces = districList.filter(obj => obj.id.includes('parking_area') && obj.id !== 'parking_area0');
    const elementsForHelsinki = (
      <>
        <div className={classes.serviceTabSubtitle}>
          <Typography><FormattedMessage id="settings.city.helsinki" /></Typography>
        </div>
        {renderDistrictList(parkingAreas)}
        <div className={classes.serviceTabSubtitle}>
          <Typography><FormattedMessage id="area.list.parkingSpaces" /></Typography>
        </div>
        <ParkingAreaList areas={parkingSpaces} variant="helsinki" />
      </>
    );

    const elementsForVantaa = (
      <>
        <div className={classes.serviceTabSubtitle}>
          <Typography><FormattedMessage id="settings.city.vantaa" /></Typography>
        </div>
        <div className={classes.serviceTabSubtitle}>
          <Typography><FormattedMessage id="area.list.parkingSpaces" /></Typography>
        </div>
        <ParkingAreaList areas={parkingSpaces} variant="vantaa" />
      </>
    );
    return (
      <>
        {citySettings.helsinki ? elementsForHelsinki : null}
        {citySettings.vantaa ? elementsForVantaa : null}
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
            <div className={classes.serviceTabSubtitle}>
              <Typography><FormattedMessage id={obj.titleID} /></Typography>
            </div>
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
      <ListItem aria-hidden={ariaHidden} key={item.titleID} className={classes.listItem} divider>
        <SMAccordion
          className={classes.accordion}
          onOpen={() => dispatch(handleOpenItems(item.id))}
          defaultOpen={defaultExpanded}
          titleContent={<Typography id={`${item.id}-content`} className={classes.bold}><FormattedMessage id={item.titleID} /></Typography>}
          collapseContent={(
            <>
              <Divider aria-hidden />
              <div className={classes.collapseArea}>
                {renderCollapseContent(item)}
              </div>
            </>
          )}
        />
      </ListItem>
    );
  };

  const districtCategoryList = dataStructure.filter(obj => obj.id !== 'geographical');

  if (!districtData.length && districtsFetching) {
    return (
      <div className={classes.loadingText}>
        <Typography aria-hidden>
          <FormattedMessage id="general.loading" />
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography style={visuallyHidden} component="h3">
        <FormattedMessage id="area.list" />
      </Typography>
      <List className={`${classes.listLevelTwo} ${classes.serviceTabCategoryList}`}>
        {districtCategoryList.map(item => renderCategoryItem(item))}
      </List>
    </div>
  );
};

ServiceTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  districtData: PropTypes.arrayOf(PropTypes.object),
  initialOpenItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  selectedAddress: PropTypes.objectOf(PropTypes.any),
};

ServiceTab.defaultProps = {
  initialOpenItems: [],
  districtData: [],
  selectedAddress: null,
};

export default React.memo(ServiceTab);
