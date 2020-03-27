

import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  Collapse,
  ButtonBase,
  Typography,
  FormControlLabel,
  Radio,
  InputBase,
  Paper,
  IconButton,
  Divider,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown, Cancel } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';
import area from '@turf/area';
import { focusDistrict } from '../MapView/utils/mapActions';
import { AreaIcon, AddressIcon } from '../../components/SMIcon';
import config from '../../../config';
import TabLists from '../../components/TabLists';


const data = [
  {
    title: 'Terveys',
    districts: [
      'health_station_district',
      'maternity_clinic_district',
    ],
  },
  {
    title: 'Koulutus',
    districts: [
      'lower_comprehensive_school_district_fi',
      'lower_comprehensive_school_district_sv',
      'upper_comprehensive_school_district_fi',
      'upper_comprehensive_school_district_sv',
    ],
    subCategories: [
      {
        subtitle: 'Suomenkieliset koulualueet',
        districts: [
          'lower_comprehensive_school_district_fi',
          'upper_comprehensive_school_district_fi',
        ],
      },
      {
        subtitle: 'Ruotsinkieliset koulualueet',
        districts: [
          'lower_comprehensive_school_district_sv',
          'upper_comprehensive_school_district_sv',
        ],
      },
    ],
  },
  {
    title: 'Esiopetus',
    districts: [
      'preschool_education_fi',
      'preschool_education_sv',
    ],
  },
  {
    title: 'Maantieteellinen',
    districts: [
      'neighborhood',
      'postcode_area',
    ],
  },
  {
    title: 'Väestönsuojelu',
    districts: [
      'rescue_area',
      'rescue_district',
      'rescue_sub_district',
    ],
  },
];

const formAddressString = address => (address
  ? `${address.street.name.fi} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}`
  : '');

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, action.value];
    case 'remove':
      return state.filter(item => item !== action.value);
    default:
      throw new Error();
  }
};

const AreaView = ({
  setSelectedDistrict,
  setDistrictData,
  setDistrictAddressData,
  districtData,
  districtAddressData,
  selectedDistrict,
  selectedDistrictData,
  addressDistrict,
  map,
  navigator,
  classes,
  intl,
}) => {
  const [radioValue, setRadioValue] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [openItems, setOpenItems] = useState([]); // List items that are expanded
  const [addressResults, setAddressResults] = useState([]); // Address search results
  const [searchBarValue, setSearchBarValue] = useState(
    formAddressString(districtAddressData.address),
  );
  const [fetching, dispatchFetching] = useReducer(fetchReducer, []); // Fetch state

  const clearDistricts = () => {
    setSelectedDistrict(null);
  };

  const focusLocalDistrict = () => {
    if (selectedAddress && addressDistrict) {
      const district = selectedDistrictData.find(obj => obj.id === addressDistrict);
      focusDistrict(map.leafletElement, district.boundary.coordinates);
    }
  };

  const handleInputChange = (text) => {
    setSearchBarValue(text);
    // Fetch address suggestions
    if (text.length && text.length > 1) {
      fetch(`${config.serviceMapAPI.root}/search/?input=${text}&page=1&page_size=5&type=address`)
        .then(res => res.json())
        .then(data => setAddressResults(data.results))
        .catch((res) => {
          console.log('error:', res);
        });
    }
  };

  const handleRadioChange = (value) => {
    setRadioValue(value);
  };

  const handleAddressSelect = (address) => {
    setSearchBarValue(formAddressString(address));
    setAddressResults([]);
    setSelectedAddress(address);
  };

  const changeDistrictData = (data, type) => {
    // Collect different periods from district data
    const dateArray = [];
    data.forEach((item) => {
      if (item.start && item.end) {
        const period = `${item.start}-${item.end}`;
        if (!dateArray.includes(period)) {
          dateArray.push(period);
        }
      }
    });
    // If different periods were found, seperate them into idividual objects
    if (dateArray.length) {
      const dataItems = dateArray.map(period => data.filter(district => `${district.start}-${district.end}` === period));
      dataItems.forEach((data, i) => {
        setDistrictData({
          id: `${type}${dateArray[i]}`, data, date: dateArray[i], name: type,
        });
      });
    } else {
      setDistrictData({ id: type, data, name: type });
    }
  };

  const compareBoundaries = (a, b) => {
    // This function checks if district b is within district a or districts are identical
    if (a.id === b.id || a.start !== b.start || a.end !== b.end) {
      return false;
    }
    if (booleanEqual(a.boundary, b.boundary)) {
      return true;
    }
    // Calculate which area is larger
    const areaA = a.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
    const areaB = b.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
    if (areaA < areaB) {
      return false;
    }

    /* Check if a point on the smaller polygon is found within the larger polygon.
    Array.every and Array.some are used because multipolygons can contain several polygons */
    return b.boundary.coordinates.every((polygon) => {
      const polygonBPoint = pointOnFeature({ type: 'Polygon', coordinates: polygon });
      return a.boundary.coordinates.some((polygon) => {
        const polygonA = { type: 'Polygon', coordinates: polygon };
        return booleanWithin(polygonBPoint, polygonA);
      });
    });
  };

  const filterFetchData = (data, type) => {
    let filteredData = [];
    data.results.forEach((district) => {
      // Skip if district is already marked as overlaping with another district
      if (filteredData.some(obj => obj.overlaping
        && obj.overlaping.some(item => item.id === district.id))) {
        return;
      }
      const returnItem = district;

      // Combine other districts that are duplicates or within this district
      const overlapingDistricts = data.results.filter(obj => compareBoundaries(district, obj));

      if (overlapingDistricts.length) {
        returnItem.overlaping = overlapingDistricts;
        // Remove overlaping districts from filtered data if already added
        overlapingDistricts.forEach((obj) => {
          filteredData = filteredData.filter(item => item.id !== obj.id);
        });
      }
      filteredData.push(returnItem);
    });

    changeDistrictData(filteredData, type);
  };

  const fetchAddressDistricts = () => {
    fetch(`https://api.hel.fi/servicemap/v2/administrative_division/?lat=${selectedAddress.location.coordinates[1]}&lon=${selectedAddress.location.coordinates[0]}&type=${data.map(item => item.districts).join(',')}&page_size=200&geometry=true&unit_include=name,location`)
      .then(response => response.json())
      .then((data) => {
        setDistrictAddressData({
          address: selectedAddress,
          districts: data.results,
        });
      });
  };

  const fetchDistrictsByType = async (type) => {
    await fetch(`https://api.hel.fi/servicemap/v2/administrative_division/?type=${type}&page_size=200&geometry=true&unit_include=name,location`)
      .then(res => res.json())
      .then((data) => {
        filterFetchData(data, type);
      })
      .catch((e) => {
        console.warn(e);
        dispatchFetching({ type: 'remove', value: type });
      });
  };

  const handleOpen = async (item) => {
    if (openItems.includes(item.title)) {
      const items = openItems.filter(i => i !== item.title);
      setOpenItems(items);
    } else {
      setOpenItems([...openItems, item.title]);
    }

    // If no fetched data found, fetch all distirct types within opened category
    if (!districtData.some(district => district.name === item.districts[0])
      && !fetching.includes(item.title)
    ) {
      dispatchFetching({ type: 'add', value: item.title });
      Promise.all(item.districts.map(i => fetchDistrictsByType(i)))
        .then(() => dispatchFetching({ type: 'remove', value: item.title }));
    }
  };


  useEffect(() => {
    if (radioValue) {
      setSelectedDistrict(radioValue);
    }
  }, [radioValue]);

  useEffect(() => {
    focusLocalDistrict();
  }, [addressDistrict]);


  useEffect(() => {
    if (selectedAddress) {
      fetchAddressDistricts();
    } else {
      setDistrictAddressData(null);
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedDistrict) {
      const category = data.find(
        obj => obj.districts.some(district => selectedDistrict.includes(district)),
      );
      handleOpen(category);
      handleRadioChange(selectedDistrict);
    }
  }, []);


  const renderDistrictList = districList => (
    <List className={classes.list} disablePadding>
      {districList.map((district, i) => (
        <ListItem
          key={district.id}
          divider={districList.length !== i + 1}
          className={classes.districtItem}
        >
          <FormControlLabel
            control={<Radio onChange={() => handleRadioChange(district.id)} />}
            checked={radioValue ? radioValue === district.id : false}
            label={(
              <>
                <Typography>
                  <FormattedMessage id={`address.list.${district.name}`} />
                </Typography>
                <Typography className={classes.captionText} variant="caption">
                  {`${district.date ? `${district.date.slice(0, 4)}-${district.date.slice(11, 15)}` : ''}`}
                </Typography>
              </>
                )}
          />
        </ListItem>
      ))}
    </List>
  );

  const renderCollapseContent = (item) => {
    if (fetching.includes(item.title)) {
      return (
        <Typography aria-live="polite">
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
          <ButtonBase className={classes.itemClickArea} onClick={() => handleOpen(item)}>
            <Typography className={classes.bold}>{item.title}</Typography>
            {isOpen ? (
              <ArrowDropDown className={classes.right} />
            ) : <ArrowDropUp className={classes.right} />
            }
          </ButtonBase>
        </div>

        <Collapse
          className={classes.categoryItemContent}
          in={isOpen}
        >
          {renderCollapseContent(item)}
        </Collapse>
      </ListItem>
    );
  };

  const renderAreaTab = () => {
    const showSuggestions = searchBarValue.length > 1 && addressResults && addressResults.length;
    return (
      <div>
        <Typography className={classes.infoText}>
        Valitse alue, jonka palveluista haluat tietoa.
        Kirjoittamalla alla olevaan hakukenttään kotiosoitteesi saat näkyville karttaan ja
        Valitun alueen palvelut -välilehdelle alueet ja piirit, joihin kuulut
        </Typography>
        <Typography
          className={classes.infoTitle}
          variant="subtitle1"
          component="h3"
        >
        Valitse alue
        </Typography>
        <List>
          {data.map(item => renderCategoryItem(item))}
        </List>

        <div className={classes.addressArea}>
          <Typography className={classes.addressTitle}><FormattedMessage id="area.searchbar.infoText.address" /></Typography>
          <InputBase
            className={classes.searchBar}
            value={searchBarValue}
            onChange={e => handleInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (showSuggestions && e.key === 'Enter') { handleAddressSelect(addressResults[0]); }
            }}
            endAdornment={(
              <IconButton
                onClick={() => {
                  setSelectedAddress(null);
                  setSearchBarValue('');
                }}
              >
                {searchBarValue.length ? (
                  <Cancel className={classes.cancelButton} />
                ) : null}
              </IconButton>
          )}
          />
          {showSuggestions ? (
            <Paper>
              <List>
                {addressResults && addressResults.map(address => (
                  <ListItem
                    key={formAddressString(address)}
                    button
                    onClick={() => handleAddressSelect(address)}
                  >
                    {formAddressString(address)}
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : null}
        </div>
      </div>
    );
  };

  const renderUnitTab = () => {
    if (!selectedDistrictData) {
      return (
        <div className={classes.containerPadding}>
          <Typography>Valitse alue Alueen Valinta -välilehdeltä</Typography>
        </div>
      );
    }

    const localDistrict = selectedDistrictData.find(obj => obj.id === addressDistrict);
    const otherDistricts = selectedDistrictData.filter(obj => obj.id !== addressDistrict);

    if (localDistrict && selectedAddress) {
      return (
        <div className={classes.containerPadding}>
          <div className={classes.subtitle}>
            <AddressIcon className={`${classes.rightPadding} ${classes.addressIcon}`} />
            <Typography className={classes.selectedAddress}>
              {formAddressString(selectedAddress)}
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.subtitle}>
            <AreaIcon className={classes.rightPadding} />
            <Typography className={classes.bold}>Oman alueesi palvelut</Typography>
          </div>
          <List>
            {localDistrict.unit && (
              <ListItem key={localDistrict.unit.id}>
                <Typography>
                  {localDistrict.unit.name.fi}
                </Typography>
              </ListItem>
            )}
            {localDistrict.overlaping && (
              localDistrict.overlaping.map(obj => (
                obj.unit && (
                  <ListItem key={obj.unit.id}>
                    <Typography>
                      {obj.unit.name.fi}
                    </Typography>
                  </ListItem>
                )
              ))
            ) }
          </List>

          <div className={classes.subtitle}>
            <AreaIcon className={classes.rightPadding} />
            <Typography className={classes.bold}>Lähialueeiden palvelut</Typography>
          </div>
          <List>
            {otherDistricts.map(item => (
              <>
                {item.unit && (
                  <ListItem key={item.unit.id}>
                    <Typography>{item.unit.name.fi}</Typography>
                  </ListItem>
                )}
                {item.overlaping && (
                  item.overlaping.map(obj => (
                    obj.unit && (
                      <ListItem key={obj.unit.id}>
                        <Typography>{obj.unit.name.fi}</Typography>
                      </ListItem>
                    )
                  ))
                )}
              </>
            ))}
          </List>
        </div>
      );
    }

    return (
      <div className={classes.containerPadding}>
        <List>
          {selectedDistrictData.map(item => (
            <>
              {item.unit && (
                <ListItem key={item.unit.id}>
                  <Typography>{item.unit.name.fi}</Typography>
                </ListItem>
              )}
              {item.overlaping && item.overlaping.map(obj => (
                obj.unit && (
                  <ListItem key={item.unit.id}>
                    <Typography>{obj.unit.name.fi}</Typography>
                  </ListItem>
                )
              ))}
            </>
          ))}
        </List>
      </div>
    );
  };

  const render = () => {
    const tabs = [
      {
        // ariaLabel: intl.formatMessage({ id: 'address.districts' }),
        component: renderAreaTab(),
        title: intl.formatMessage({ id: 'area.tab.selection' }),
      },
      {
        // ariaLabel: intl.formatMessage({ id: 'address.districts' }),
        component: renderUnitTab(),
        title: intl.formatMessage({ id: 'area.tab.services' }),
      },
    ];
    return (
      <>
        <div className={classes.topBar} />
        <TabLists
          data={tabs}
        />
      </>
    );
  };

  return render();
};

AreaView.propTypes = {
  setSelectedDistrict: PropTypes.func.isRequired,
};

export default AreaView;
