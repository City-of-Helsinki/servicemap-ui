import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, Typography, ListItem } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage } from 'react-intl';
import { FormatListBulleted, LocationOn } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DistrictToggleButton from '../DistrictToggleButton';
import {
  fetchDistrictGeometry,
  handleOpenGeographicalCategory,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import { getFilteredSubdistrictServices } from '../../../../redux/selectors/district';
import GeographicalDistrictList from '../GeographicalDistrictList';
import GeographicalUnitList from '../GeographicalUnitList';
import useLocaleText from '../../../../utils/useLocaleText';
import { geographicalDistricts } from '../../utils/districtDataHelper';
import { getAddressText } from '../../../../utils/address';
import {
  SMAccordion,
} from '../../../../components';


const GeographicalTab = ({
  initialOpenItems,
  clearRadioButtonValue,
  classes,
}) => {
  const dispatch = useDispatch();
  const filteredSubdistrictUnitsLength = useSelector(
    state => getFilteredSubdistrictServices(state).length,
  );
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const localAddressData = useSelector(state => state.districts.districtAddressData);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const districtData = useSelector(state => state.districts.districtData);
  const map = useSelector(state => state.mapRef);
  const getLocaleText = useLocaleText();

  const [openCategory, setOpenCategory] = useState(
    useSelector(state => state.districts.openItems).find(item => geographicalDistricts.includes(item)) || [],
  );


  const setRadioButtonValue = (district) => {
    if (!district.data.some(obj => obj.boundary)) {
      dispatch(fetchDistrictGeometry(district.name));
    }
    dispatch(setSelectedDistrictType(district.id));
    dispatch(setSelectedDistrictServices([]));
    const localDistrict = localAddressData.districts.find(obj => obj.type === district.name);
    if (localDistrict) {
      dispatch(setSelectedSubdistricts([localDistrict.ocd_id]));
    } else {
      dispatch(setSelectedSubdistricts([]));
    }
  };

  const handleCategoryOpen = (id) => {
    setOpenCategory(id);
    dispatch(handleOpenGeographicalCategory(id));
  };

  const handleRadioChange = (district, e) => {
    e.stopPropagation();
    if (selectedDistrictType === district.id) {
      clearRadioButtonValue();
      setOpenCategory(null);
    } else {
      setRadioButtonValue(district);
      handleCategoryOpen(district.id);
    }
  };

  const handleAccordionToggle = (district, opening) => {
    if (opening) {
      if (selectedDistrictType !== district.id) {
        setRadioButtonValue(district);
      }
      handleCategoryOpen(district.id);
    } else {
      setOpenCategory(null);
    }
  };

  useEffect(() => {
    if (!selectedDistrictType || !geographicalDistricts.includes(selectedDistrictType)) {
      dispatch(setSelectedSubdistricts([]));
      dispatch(setSelectedDistrictServices([]));
      setOpenCategory(null);
    }
  }, [selectedDistrictType]);


  const renderAddressInfo = useCallback(() => {
    const localPostArea = localAddressData.districts.find(obj => obj.type === 'postcode_area');
    const localNeighborhood = localAddressData.districts.find(obj => obj.type === 'neighborhood');
    return (
      <div className={classes.addressInfoContainer}>
        <Typography component="h3" className={classes.addressInfoText}><FormattedMessage id="area.localAddress.title" /></Typography>
        <div className={classes.addressInfoIconArea}>
          <LocationOn color="primary" className={classes.addressInfoIcon} />
          <Typography component="p" variant="subtitle1">{getAddressText(localAddressData.address, getLocaleText)}</Typography>
        </div>
        {localPostArea ? (
          <Typography className={classes.addressInfoText}>
            <FormattedMessage id="area.localAddress.postCode" values={{ area: getLocaleText(localPostArea.name) }} />
          </Typography>
        ) : null}
        {localNeighborhood ? (
          <Typography className={classes.addressInfoText}>
            <FormattedMessage id="area.localAddress.neighborhood" values={{ area: getLocaleText(localNeighborhood.name) }} />
          </Typography>
        ) : null}
      </div>
    );
  }, [localAddressData]);


  const render = () => {
    const districtItems = districtData.filter(obj => geographicalDistricts.includes(obj.id));
    return (
      <>
        {localAddressData?.address && localAddressData.districts?.length && (
          renderAddressInfo()
        )}
        <Typography style={visuallyHidden} component="h4">
          <FormattedMessage id="area.list" />
        </Typography>
        <List className={`${classes.listNoPadding} ${classes.listLevelTwo}`}>
          {districtItems.map((district) => {
            const opened = openCategory === district.id;
            const selected = selectedDistrictType === district.id;
            return (
              <ListItem
                // divider
                disableGutters
                key={district.id}
                className={`${classes.listItem} ${district.id}`}
              >
                <SMAccordion // Top level categories (neighborhood and postcode area)
                  defaultOpen={initialOpenItems.includes(district.id)}
                  className={classes.geographicalCategoryListAccordion}
                  onOpen={(e, open) => handleAccordionToggle(district, !open)}
                  isOpen={opened}
                  elevated={opened}
                  adornment={(
                    <DistrictToggleButton
                      selected={selected}
                      district={district}
                      onToggle={e => handleRadioChange(district, e)}
                      aria-hidden
                    />
                  )}
                  titleContent={(
                    <Typography id={`${district.id}Name`}>
                      <FormattedMessage id={`area.list.${district.name}`} />
                    </Typography>
                  )}
                  collapseContent={(
                    <div className={`${classes.districtServiceList} ${classes.listLevelThree}`}>
                      <SMAccordion // Unit list accordion
                        defaultOpen={initialOpenItems.some(item => typeof item === 'number')}
                        disabled={!filteredSubdistrictUnitsLength}
                        className={classes.unitsAccordion}
                        adornment={<FormatListBulleted className={classes.iconPadding} />}
                        titleContent={(
                          <Typography className={classes.captionText} variant="caption">
                            <FormattedMessage
                              id={`area.geographicalServices.${district.id}`}
                              values={{ length: filteredSubdistrictUnitsLength }}
                            />
                          </Typography>
                        )}
                        collapseContent={(
                          <GeographicalUnitList
                            initialOpenItems={initialOpenItems}
                          />
                        )}
                      />
                      <GeographicalDistrictList // District selection list
                        district={district}
                        map={map}
                      />
                    </div>
                  )}
                />
              </ListItem>
            );
          })}
        </List>
      </>
    );
  };

  if (!districtData.length && districtsFetching) {
    return (
      <div className={classes.loadingText}>
        <Typography aria-hidden>
          <FormattedMessage id="general.loading" />
        </Typography>
      </div>
    );
  }

  return render();
};

GeographicalTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  initialOpenItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

GeographicalTab.defaultProps = {
  initialOpenItems: [],
};

export default React.memo(GeographicalTab);
