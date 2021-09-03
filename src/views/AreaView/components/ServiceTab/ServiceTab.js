import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  Typography,
  Divider,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import SMAccordion from '../../../../components/SMAccordion';
import { fetchDistrictGeometry, handleOpenItems, setSelectedDistrictType } from '../../../../redux/actions/district';
import DistrictUnitList from '../DistrictUnitList';
import DistrictToggleButton from '../DistrictToggleButton';
import { dataStructure } from '../../utils/districtDataHelper';
import DistrictAreaList from '../DistrictAreaList';

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
  const selectedCategory = dataStructure.find(
    data => data.districts.includes(selectedDistrictType),
  )?.id;

  const handleRadioChange = (district) => {
    if (selectedDistrictType === district.id) {
      dispatch(setSelectedDistrictType(null));
    } else {
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
    const listDistrictAreas = ['rescue_district', 'rescue_sub_district'].includes(selectedDistrictType);
    const DistrictList = listDistrictAreas ? DistrictAreaList : DistrictUnitList;
    return (
      <List className="districtList" disablePadding>
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
    const defaultExpanded = initialOpenItems.includes(item.id) || selectedCategory === item.id;
    return (
      <ListItem key={item.titleID} className={classes.listItem} divider>
        <SMAccordion
          className={classes.accodrion}
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
      <Typography variant="srOnly" component="h3">
        <FormattedMessage id="area.list" />
      </Typography>
      <List>
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
