import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, FormControlLabel, Radio, Typography, ButtonBase, Collapse, RadioGroup,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { ArrowDropUp, ArrowDropDown, Map } from '@material-ui/icons';
import { AreaIcon } from '../../../../components/SMIcon';
import AddressSearchBar from '../../../../components/AddressSearchBar';
import MobileComponent from '../../../../components/MobileComponent';
import SMButton from '../../../../components/ServiceMapButton';

const AreaTab = ({
  districtRadioValue,
  subdistrictRadioValue,
  setDistrictRadioValue,
  setSubdistrictRadioValue,
  fetching,
  districtData,
  selectedDistrictData,
  openItems,
  handleOpen,
  dataStructure,
  setSelectedAddress,
  address,
  classes,
  navigator,
  getLocaleText,
}) => {
  const hadleDistrictChange = (district) => {
    setDistrictRadioValue(district.id);
    setSubdistrictRadioValue(null);
  };

  const handleSubdistrictChange = (event) => {
    setSubdistrictRadioValue(event.target.value);
  };

  const clearRadioValues = () => {
    setDistrictRadioValue(null);
    setSubdistrictRadioValue(null);
  };

  const sortSubdistricts = (districts) => {
    districts.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));
  };

  const showSubdistricts = (district) => {
    if (selectedDistrictData.length) {
      if (district.id === 'neighborhood' && selectedDistrictData[0].type === 'neighborhood') {
        sortSubdistricts(selectedDistrictData);
        return true;
      }
      if (district.id === 'postcode_area' && selectedDistrictData[0].type === 'postcode_area') {
        sortSubdistricts(selectedDistrictData);
        return true;
      }
    }
    return false;
  };

  const renderDistrictList = districList => (
    <List className={classes.list} disablePadding>
      {districList.map((district, i) => (
        <Fragment key={district.id}>
          <ListItem
            key={district.id}
            divider={districList.length !== i + 1}
            className={`${classes.districtItem} ${district.id}`}
          >
            <FormControlLabel
              control={(
                <Radio
                  inputProps={{ 'aria-setsize': districtData.length.toString() }}
                  onChange={() => hadleDistrictChange(district)}
                  aria-labelledby={`${`${district.id}Name`} ${`${district.id}Period`}`}
                />
              )}
              checked={districtRadioValue ? districtRadioValue === district.id : false}
              label={(
                <>
                  <Typography id={`${district.id}Name`} aria-hidden>
                    <FormattedMessage id={`area.list.${district.name}`} />
                  </Typography>
                  <Typography id={`${district.id}Period`} aria-hidden className={classes.captionText} variant="caption">
                    {`${district.date ? `${district.date.slice(0, 4)}-${district.date.slice(11, 15)}` : ''}`}
                  </Typography>
                </>
            )}
            />
          </ListItem>
          {showSubdistricts(district) ? (
            <List disablePadding style={{ paddingLeft: 32 }}>
              <RadioGroup aria-label="valitse kaupunginosa" value={subdistrictRadioValue} onChange={handleSubdistrictChange}>
                {selectedDistrictData.map(districtItem => (
                  <FormControlLabel
                    key={districtItem.id}
                    value={districtItem.ocd_id}
                    control={<Radio />}
                    label={<Typography>{getLocaleText(districtItem.name)}</Typography>}
                  />
                ))}
              </RadioGroup>
            </List>
          ) : null}
        </Fragment>
      ))}
    </List>
  );


  const renderCollapseContent = (item) => {
    if (fetching.includes(item.title)) {
      return (
        <Typography aria-hidden>
          <FormattedMessage id="general.loading" />
        </Typography>
      );
    }
    if (item.subCategories) {
      return item.subCategories.map((obj) => {
        const districList = districtData.filter(i => obj.districts.includes(i.name));
        return (
          <div key={obj.subtitle}>
            <div className={classes.subtitle}><Typography>{obj.subtitle}</Typography></div>
            {renderDistrictList(districList)}
          </div>
        );
      });
    }

    const districList = districtData.filter(i => item.districts.includes(i.name));
    return renderDistrictList(districList);
  };


  const renderCategoryItem = (item) => {
    const isOpen = openItems.includes(item.title);
    return (
      <ListItem
        key={item.title}
        className={classes.categoryItem}
        divider
      >
        <div className={classes.categoryItemTitle}>
          <AreaIcon className={classes.rightPadding} />
          <ButtonBase
            aria-expanded={isOpen}
            aria-label={item.title}
            className={classes.itemClickArea}
            onClick={() => handleOpen(item)}
          >
            <Typography className={classes.bold}>{item.title}</Typography>
            {isOpen ? (
              <ArrowDropUp className={classes.right} />
            ) : <ArrowDropDown className={classes.right} />
            }
          </ButtonBase>
        </div>

        <Collapse
          className={classes.categoryItemContent}
          aria-hidden={!isOpen}
          in={isOpen}
        >
          {isOpen ? (
            renderCollapseContent(item)
          ) : null}
        </Collapse>
      </ListItem>
    );
  };


  return (
    <div>
      <Typography className={classes.infoText}>
        <FormattedMessage id="area.info" />
      </Typography>
      <div className={classes.addressArea}>
        <AddressSearchBar
          defaultAddress={address}
          handleAddressChange={setSelectedAddress}
          title={(
            <>
              <FormattedMessage id="area.searchbar.infoText.address" />
              {' '}
              <FormattedMessage id="area.searchbar.infoText.optional" />
            </>
          )}
        />
      </div>
      <div className={classes.infoTitle}>
        <Typography variant="subtitle1" component="h3">
          <FormattedMessage id="area.choose.district" />
        </Typography>
        {districtRadioValue ? (
          <ButtonBase onClick={() => clearRadioValues()}>
            <Typography className={classes.deleteLink}>
              <FormattedMessage id="services.selections.delete" />
            </Typography>
          </ButtonBase>
        ) : null}
      </div>
      <List>
        {dataStructure.map(item => renderCategoryItem(item))}
      </List>

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
      {(fetching.length || districtData.length) ? (
        <Typography variant="srOnly" role="alert">
          {fetching.length
            ? <FormattedMessage id="general.loading" />
            : <FormattedMessage id="general.loading.done" />}
        </Typography>
      ) : null}
    </div>
  );
};

AreaTab.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  districtRadioValue: PropTypes.string,
  subdistrictRadioValue: PropTypes.string,
  fetching: PropTypes.arrayOf(PropTypes.any).isRequired,
  districtData: PropTypes.arrayOf(PropTypes.object),
  selectedDistrictData: PropTypes.arrayOf(PropTypes.object),
  openItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  address: PropTypes.objectOf(PropTypes.any),
  dataStructure: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setDistrictRadioValue: PropTypes.func.isRequired,
  setSubdistrictRadioValue: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

AreaTab.defaultProps = {
  navigator: null,
  districtRadioValue: null,
  subdistrictRadioValue: null,
  districtData: [],
  selectedDistrictData: [],
  address: null,
};

export default AreaTab;
