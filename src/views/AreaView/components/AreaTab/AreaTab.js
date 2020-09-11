import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  FormControlLabel,
  Radio,
  Typography,
  ButtonBase,
  Collapse,
  ExpansionPanel,
  ExpansionPanelSummary,
  FormGroup,
  Checkbox,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { ArrowDropUp, ArrowDropDown, Map } from '@material-ui/icons';
import { AreaIcon } from '../../../../components/SMIcon';
import AddressSearchBar from '../../../../components/AddressSearchBar';
import MobileComponent from '../../../../components/MobileComponent';
import SMButton from '../../../../components/ServiceMapButton';

const AreaTab = ({
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
}) => {
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  const handleRadioChange = (district) => {
    setSelectedSubdistricts([]);
    setDistrictRadioValue(district.id);
    setExpandedSubcategory(null);
  };

  const handleCheckboxChange = (event, district) => {
    let newArray;
    if (event.target.checked) {
      newArray = [...selectedSubdistricts, district.ocd_id];
    } else {
      newArray = selectedSubdistricts.filter(service => service !== district.ocd_id);
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
          <Typography id={`${district.id}Period`} aria-hidden className={classes.captionText} variant="caption">
            {`${district.date ? `${district.date.slice(0, 4)}-${district.date.slice(11, 15)}` : ''}`}
          </Typography>
        </>
      )}
    />
  );

  const renderExpandingDistrictItem = (district) => {
    sortSubdistricts(selectedDistrictData);
    return (
      <ExpansionPanel
        onChange={(e, expanded) => handleSubcategoryExpand(expanded, district)}
        classes={{ expanded: classes.expandedUnitCategory, root: classes.expandingElement }}
        CollapseProps={{ unmountOnExit: true }}
        expanded={expandedSubcategory === district.id}
      >
        <ExpansionPanelSummary
          expandIcon={<ArrowDropDown />}
          classes={{ content: classes.centerItems, root: classes.testPadding }}
        >
          {renderDistrictItem(district)}
        </ExpansionPanelSummary>
        <List disablePadding className={classes.subdistrictList}>
          <FormGroup aria-label={intl.formatMessage({ id: `area.subdistrict.${district.id}` })}>
            {selectedDistrictData.map(districtItem => (
              <FormControlLabel
                key={districtItem.id}
                value={districtItem.ocd_id}
                control={(
                  <Checkbox
                    checked={selectedSubdistricts.includes(districtItem.ocd_id)}
                    onChange={e => handleCheckboxChange(e, districtItem)}
                  />
                )}
                label={<Typography>{getLocaleText(districtItem.name)}</Typography>}
              />
            ))}
          </FormGroup>
        </List>
      </ExpansionPanel>
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
    const isOpen = openItems.includes(item.id);
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
  fetching: PropTypes.arrayOf(PropTypes.any).isRequired,
  districtData: PropTypes.arrayOf(PropTypes.object),
  selectedDistrictData: PropTypes.arrayOf(PropTypes.object),
  openItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  address: PropTypes.objectOf(PropTypes.any),
  dataStructure: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setDistrictRadioValue: PropTypes.func.isRequired,
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
