import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  FormControlLabel,
  Radio,
  Typography,
  ButtonBase,
  Accordion,
  AccordionSummary,
  FormGroup,
  Checkbox,
  AccordionDetails,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { ArrowDropDown, Map } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AreaIcon } from '../../../../components/SMIcon';
import AddressSearchBar from '../../../../components/AddressSearchBar';
import MobileComponent from '../../../../components/MobileComponent';
import SettingsInfo from '../../../../components/SettingsInfo';
import SMButton from '../../../../components/ServiceMapButton';

const AreaTab = (props) => {
  const {
    districtRadioValue,
    selectedSubdistricts,
    setDistrictRadioValue,
    setSelectedSubdistricts,
    setSelectedDistrictServices,
    fetching,
    districtData,
    selectedDistrictData,
    openItems,
    handleOpen,
    dataStructure,
    setSelectedAddress,
    address,
    classes,
    intl,
    navigator,
    getLocaleText,
  } = props;
  const citySettings = useSelector(state => state.settings.cities);
  const defaultExpanded = selectedSubdistricts.length;
  const [expandedSubcategory, setExpandedSubcategory] = useState(defaultExpanded);

  const handleRadioChange = (district) => {
    setSelectedSubdistricts([]);
    setDistrictRadioValue(district.id);
    setExpandedSubcategory(null);
    setSelectedDistrictServices([]);
  };

  const handleCheckboxChange = (event, district) => {
    let newArray;
    if (event.target.checked) {
      newArray = [...selectedSubdistricts, district.ocd_id];
    } else {
      newArray = selectedSubdistricts.filter(i => i !== district.ocd_id);
    }
    if (newArray === []) {
      setSelectedDistrictServices([]);
    }
    setSelectedSubdistricts(newArray);
  };

  const handleSubcategoryExpand = (expanded, district) => {
    if (expanded) {
      if (districtRadioValue !== district.id) {
        setSelectedSubdistricts([]);
      }
      setDistrictRadioValue(district.id);
      setExpandedSubcategory(district.id);
    } else {
      setExpandedSubcategory(null);
    }
  };

  const clearRadioValues = () => {
    setSelectedSubdistricts([]);
    setDistrictRadioValue(null);
    setExpandedSubcategory(null);
  };

  const sortSubdistricts = (districts) => {
    districts.sort((a, b) => getLocaleText(a.name).localeCompare(getLocaleText(b.name)));
  };


  const renderDistrictItem = district => (
    <FormControlLabel
      onClick={event => event.stopPropagation()}
      onFocus={event => event.stopPropagation()}
      control={(
        <Radio
          inputProps={{ 'aria-setsize': districtData.length.toString() }}
          onChange={() => handleRadioChange(district)}
          aria-labelledby={`${`${district.id}Name`} ${`${district.id}Period`}`}
        />
      )}
      checked={districtRadioValue ? districtRadioValue === district.id : false}
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

  const renderExpandingDistrictItem = (district) => {
    sortSubdistricts(selectedDistrictData);
    // Divide data into individual arrays based on municipality
    const groupedData = selectedDistrictData.reduce((acc, cur) => {
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

    const expandedState = expandedSubcategory === district.id;

    return (
      <Accordion
        square
        onChange={(e, expanded) => handleSubcategoryExpand(expanded, district)}
        classes={{ root: classes.expandingElement }}
        TransitionProps={{ timeout: 250, unmountOnExit: true }}
        defaultExpanded={defaultExpanded === district.id}
        expanded={expandedState}
      >
        <AccordionSummary
          aria-label={!expandedState
            ? intl.formatMessage({ id: 'area.choose.subdistrict' }, { category: intl.formatMessage({ id: `area.list.${district.name}` }) })
            : intl.formatMessage({ id: 'area.close.subdistrict' }, { category: intl.formatMessage({ id: `area.list.${district.name}` }) })
          }
          expandIcon={<ArrowDropDown />}
          classes={{ root: classes.accordionSummary }}
        >
          {renderDistrictItem(district)}
        </AccordionSummary>
        <AccordionDetails className={classes.subdistrictContainer}>
          {cityFilteredData.map((data) => {
            const { municipality } = data[0];
            return (
              <React.Fragment key={municipality}>
                <div className={classes.municipalitySubtitle}>
                  <Typography component="h4" className={classes.bold}>
                    <FormattedMessage id={`settings.city.${municipality}`} />
                  </Typography>
                </div>
                <FormGroup>
                  <List disablePadding className={classes.subdistrictList}>
                    {data.map(districtItem => (
                      <ListItem key={districtItem.id}>
                        <FormControlLabel
                          value={districtItem.ocd_id}
                          control={(
                            <Checkbox
                              onChange={e => handleCheckboxChange(e, districtItem)}
                              checked={selectedSubdistricts.some(
                                district => district === districtItem.ocd_id,
                              )}
                            />
                          )}
                          label={<Typography>{getLocaleText(districtItem.name)}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </FormGroup>
              </React.Fragment>
            );
          })}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderDistrictList = districList => (
    <List className={classes.list} disablePadding>
      {districList.map((district, i) => (
        <Fragment key={district.id}>
          <ListItem
            key={district.id}
            divider={districList.length !== i + 1}
            className={`${classes.districtItem} ${district.id}`}
            focusVisibleClassName={classes.test}
          >
            {district.id === 'neighborhood' || district.id === 'postcode_area'
              ? renderExpandingDistrictItem(district)
              : renderDistrictItem(district)
            }
          </ListItem>
        </Fragment>
      ))}
    </List>
  );


  const renderCollapseContent = (item) => {
    if (fetching.includes(item.title)) {
      return (
        <div className={classes.loadingText}>
          <Typography aria-hidden>
            <FormattedMessage id="general.loading" />
          </Typography>
        </div>
      );
    }
    if (item.subCategories) {
      return item.subCategories.map((obj) => {
        const districList = districtData.filter(i => obj.districts.includes(i.name));
        return (
          <React.Fragment key={obj.subtitle}>
            <div className={classes.subtitle}><Typography>{obj.subtitle}</Typography></div>
            {renderDistrictList(districList)}
          </React.Fragment>
        );
      });
    }

    const districList = districtData.filter(i => item.districts.includes(i.name));
    return renderDistrictList(districList);
  };


  const renderCategoryItem = (item) => {
    const expanded = openItems.includes(item.id);
    return (
      <ListItem
        key={item.title}
        className={classes.categoryItem}
        divider
      >
        <Accordion
          classes={{ root: classes.expandingElement }}
          onChange={() => handleOpen(item)}
          expanded={expanded}
          TransitionProps={{
            unmountOnExit: true,
          }}
        >
          <AccordionSummary
            id={`${item.id}-header`}
            aria-controls={`${item.id}-content`}
            expandIcon={<ArrowDropDown />}
            classes={{ root: classes.accordionSummary }}
          >
            <div id={`${item.id}-content`} className={classes.categoryItemTitle}>
              <AreaIcon className={classes.rightPadding} />
              <Typography className={classes.bold}>{item.title}</Typography>
            </div>

          </AccordionSummary>
          {renderCollapseContent(item)}
        </Accordion>
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
  fetching: PropTypes.arrayOf(PropTypes.any).isRequired,
  districtData: PropTypes.arrayOf(PropTypes.object),
  selectedDistrictData: PropTypes.arrayOf(PropTypes.object),
  openItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  address: PropTypes.objectOf(PropTypes.any),
  dataStructure: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setDistrictRadioValue: PropTypes.func.isRequired,
  setSelectedDistrictServices: PropTypes.func.isRequired,
  setSelectedSubdistricts: PropTypes.func.isRequired,
  selectedSubdistricts: PropTypes.arrayOf(PropTypes.string).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

AreaTab.defaultProps = {
  navigator: null,
  districtRadioValue: null,
  districtData: [],
  selectedDistrictData: [],
  address: null,
};

export default AreaTab;
