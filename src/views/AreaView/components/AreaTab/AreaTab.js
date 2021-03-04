import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  Typography,
  RadioGroup,
  Divider,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Map } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import MobileComponent from '../../../../components/MobileComponent';
import SettingsInfo from '../../../../components/SettingsInfo';
import SMButton from '../../../../components/ServiceMapButton';
import SMAccordion from '../../../../components/SMAccordion';
import { fetchDistrictGeometry, setSelectedDistrictType } from '../../../../redux/actions/district';
import DistrictUnitList from '../DistrictUnitList';
import DistrictToggleButton from '../DistrictToggleButton';
import { dataStructure } from '../../utils/districtDataHelper';

const AreaTab = (props) => {
  const {
    selectedAddress,
    districtData,
    intitialOpenItems,
    handleOpen,
    navigator,
    getLocaleText,
    classes,
  } = props;
  const dispatch = useDispatch();
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const selectedCategory = dataStructure.find(
    data => data.districts.includes(selectedDistrictType),
  )?.id;

  const handleRadioChange = (district) => {
    if (selectedDistrictType === district.id) {
      dispatch(setSelectedDistrictType(null));
    } else {
      if (!district.data.some(obj => obj.boundary)) {
        dispatch(fetchDistrictGeometry(district.name));
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


  const renderDistrictList = districList => (
    <List disablePadding>
      {districList.map((district, i) => (
        <Fragment key={district.id}>
          <ListItem
            key={district.id}
            divider={districList.length !== i + 1}
            className={`${classes.listItem} ${classes.areaItem} ${district.id}`}
          >
            {renderDistrictItem(district)}
          </ListItem>

          {/* Service list */}
          {selectedDistrictType === district.id && (
            <DistrictUnitList
              district={district}
              selectedAddress={selectedAddress}
              getLocaleText={getLocaleText}
            />
          )}
        </Fragment>
      ))}
    </List>
  );


  const renderCollapseContent = (item) => {
    if (item.subCategories) {
      return item.subCategories.map((obj) => {
        const districList = districtData.filter(i => obj.districts.includes(i.name));
        return (
          <React.Fragment key={obj.titleID}>
            <div className={classes.subtitle}>
              <Typography><FormattedMessage id={obj.titleID} /></Typography>
            </div>
            {renderDistrictList(districList)}
          </React.Fragment>
        );
      });
    }

    const districList = districtData.filter(i => item.districts.includes(i.name));
    return renderDistrictList(districList);
  };


  const renderCategoryItem = (item) => {
    const defaultExpanded = intitialOpenItems.includes(item.id) || selectedCategory === item.id;
    return (
      <ListItem key={item.titleID} className={classes.listItem} divider>
        <SMAccordion
          className={classes.accodrion}
          onOpen={() => handleOpen(item)}
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
      <List>
        <RadioGroup value={selectedDistrictType}>
          {districtCategoryList.map(item => renderCategoryItem(item))}
        </RadioGroup>
      </List>
      <SettingsInfo
        onlyCities
        title="settings.info.title.city"
        altTitle="settings.info.title.noSettings.city"
        settingsPage="area"
        noDivider
      />

      <MobileComponent>
        <SMButton
          role="link"
          margin
          messageID="general.showOnMap"
          icon={<Map />}
          className={classes.mapButton}
          onClick={() => navigator.openMap()}
        />
      </MobileComponent>
    </div>
  );
};

AreaTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  districtData: PropTypes.arrayOf(PropTypes.object),
  intitialOpenItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  handleOpen: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

AreaTab.defaultProps = {
  intitialOpenItems: [],
  navigator: null,
  districtData: [],
  selectedAddress: null,
};

export default React.memo(AreaTab);
