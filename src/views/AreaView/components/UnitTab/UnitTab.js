import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, Typography, ListItem } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormatListBulleted, LocationOn } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import SMAccordion from '../../../../components/SMAccordion';
import DistrictToggleButton from '../DistrictToggleButton';
import {
  fetchDistrictGeometry,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import { getSubdistrictServices } from '../../../../redux/selectors/district';
import GeographicalDistrictList from '../GeographicalDistrictList';
import GeographicalUnitList from '../GeographicalUnitList.js';


const UnitTab = ({
  handleOpen,
  formAddressString,
  clearRadioButtonValue,
  getLocaleText,
  classes,
}) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const areaViewState = useSelector(state => state.districts.areaViewState);
  const filteredSubdistrictUnitsLength = useSelector(state => getSubdistrictServices(state).length);
  const localAddressData = useSelector(state => state.districts.districtAddressData);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const districtData = useSelector(state => state.districts.districtData);
  const map = useSelector(state => state.mapRef);

  const [initialOpenItems] = useState(areaViewState?.openItems || []);
  const [openCategory, setOpenCategory] = useState(areaViewState?.openItems.find(item => item === 'neighborhood' || item === 'postcode_area') || []);


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


  const handleRadioChange = (district, e) => {
    e.stopPropagation();
    setOpenCategory(null);
    if (selectedDistrictType === district.id) {
      clearRadioButtonValue();
    } else {
      setRadioButtonValue(district);
    }
  };

  const handleAccordionToggle = (district, opening) => {
    handleOpen(district);
    if (opening) {
      if (selectedDistrictType !== district.id) {
        setRadioButtonValue(district);
      }
      setOpenCategory(district.id);
    } else {
      setOpenCategory(null);
    }
  };

  useEffect(() => {
    if (selectedDistrictType && selectedDistrictType !== 'neighborhood' && selectedDistrictType !== 'postcode_area') {
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
        <Typography className={classes.addressInfoText}><FormattedMessage id="area.localAddress.title" /></Typography>
        <div className={classes.addressInfoIconArea}>
          <LocationOn color="primary" className={classes.addressInfoIcon} />
          <Typography variant="subtitle1">{formAddressString(localAddressData.address)}</Typography>
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
    const districtItems = districtData.filter(obj => obj.id === 'neighborhood' || obj.id === 'postcode_area');
    return (
      <>
        {localAddressData?.address && localAddressData.districts?.length && (
          renderAddressInfo()
        )}
        <List>
          {districtItems.map((district) => {
            const opened = openCategory === district.id;
            const selected = selectedDistrictType === district.id;
            return (
              <ListItem
                divider
                disableGutters
                key={district.id}
                className={`${classes.listItem} ${district.id}`}
              >
                <SMAccordion // Top level categories (neighborhood and postcode area)
                  defaultOpen={initialOpenItems.includes(district.id)}
                  onOpen={(e, open) => handleAccordionToggle(district, !open)}
                  openButtonSrText={
                    !opened
                      ? intl.formatMessage({ id: 'area.choose.subdistrict' }, { category: intl.formatMessage({ id: `area.list.${district.name}` }) })
                      : intl.formatMessage({ id: 'area.close.subdistrict' }, { category: intl.formatMessage({ id: `area.list.${district.name}` }) })
                  }
                  isOpen={opened}
                  elevated={opened}
                  adornment={(
                    <DistrictToggleButton
                      selected={selected}
                      district={district}
                      onToggle={e => handleRadioChange(district, e)}
                    />
                  )}
                  titleContent={(
                    <Typography id={`${district.id}Name`} aria-hidden>
                      <FormattedMessage id={`area.list.${district.name}`} />
                    </Typography>
                  )}
                  collapseContent={(
                    <div className={classes.districtServiceList}>
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
                            handleOpen={handleOpen}
                            getLocaleText={getLocaleText}
                          />
                        )}
                      />
                      <GeographicalDistrictList // District selection list
                        district={district}
                        map={map}
                        getLocaleText={getLocaleText}
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

  return render();
};

UnitTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  handleOpen: PropTypes.func.isRequired,
  formAddressString: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

export default React.memo(UnitTab);
