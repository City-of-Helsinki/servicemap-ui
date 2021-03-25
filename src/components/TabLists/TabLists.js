/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs, Tab, Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { parseSearchParams, stringifySearchParams } from '../../utils';
import ResultOrderer from '../ResultOrderer';
import config from '../../../config';
import useMobileStatus from '../../utils/isMobile';
import AddressSearchBar from '../AddressSearchBar';
import PaginatedList from '../Lists/PaginatedList';

const TabLists = ({
  changeCustomUserLocation,
  location,
  data,
  onTabChange,
  focusClass,
  focusText,
  headerComponents,
  navigator,
  classes,
  userAddress,
}) => {
  const isMobile = useMobileStatus();

  const searchParams = parseSearchParams(location.search);
  const filteredData = data.filter(item => item.component || (item.data && item.data.length > 0));
  const getTabfromUrl = () => {
    let index = data.findIndex(tab => tab.id === searchParams.t);
    if (index === -1) index = parseInt(searchParams.t, 10) || 0;
    if (filteredData.length <= index) {
      return 0;
    }
    return index;
  };

  const sidebarClass = 'SidebarWrapper';

  const [scrollDistance, setScrollDistance] = useState(0);
  const [tabIndex, setTabIndex] = useState(getTabfromUrl());
  const [styles, setStyles] = useState({});

  const tabsRef = useRef(null);

  // Default tabindex if it's out of bound
  if (filteredData.length <= tabIndex) {
    setTabIndex(0);
  }

  const handleAddressChange = (address) => {
    if (address) {
      changeCustomUserLocation(
        [address.location.coordinates[1], address.location.coordinates[0]],
        address,
      );
    } else {
      changeCustomUserLocation(null);
    }
  };
  const adjustScrollDistance = (scroll = null) => {
    let scrollDistanceFromTop = scrollDistance;
    const elem = document.getElementsByClassName(sidebarClass)[0];
    const elemOverflow = window.getComputedStyle(elem, null).getPropertyValue('overflow');

    // Adjust scroll to given number
    if (typeof scroll === 'number') {
      scrollDistanceFromTop = scroll;
      if (elemOverflow !== 'auto') {
        window.scrollTo(0, scrollDistanceFromTop);
      } else {
        elem.scrollTop = scrollDistanceFromTop;
      }
      return;
    }

    // Adjust sidebar scroll to match TabList header's sticky elements' combined height
    if (elemOverflow !== 'auto' && window.scrollY > scrollDistance) {
      window.scrollTo(0, scrollDistanceFromTop);
    } else if (elem.scrollTop > scrollDistance) {
      elem.scrollTop = scrollDistanceFromTop;
    }
  };

  // Handle tab change
  const handleTabChange = (e, value) => {
    // Prevent tab handling for current tab click
    if (tabIndex === value) {
      return;
    }
    if (onTabChange) {
      onTabChange();
    }
    // Update p(page) param to current history
    // Change page parameter in searchParams
    const searchParams = parseSearchParams(location.search);
    searchParams.p = 1;

    if (data[value].id) {
      searchParams.t = data[value].id;
    } else {
      searchParams.t = value;
    }

    // Get new search search params string
    const searchString = stringifySearchParams(searchParams);
    setTabIndex(value);

    // Update p(page) param to current history
    if (navigator) {
      navigator.replace({
        ...location,
        search: `?${searchString || ''}`,
      });
    }
    adjustScrollDistance();
  };

  const calculateHeaderStylings = () => {
    if (!tabsRef || !tabsRef.current) {
      return;
    }
    // Sticky relation is different on mobile (root relation) and desktop (current content relation)
    const appBarHeight = isMobile ? config.topBarHeightMobile : config.topBarHeight;

    // Reset scroll to avoid scrolled sticky  elements having inconsistent offsetTop
    const elem = document.getElementsByClassName(sidebarClass)[0];
    elem.scrollTop = 0;

    // Calculate height by looping through Tabs root element's previous siblings
    // Change sidebar scroll to match TabList header's sticky elements' combined height
    const tabsElem = tabsRef.current;
    const tabsHeight = tabsElem.clientHeight;
    const tabsDistanceFromTop = tabsElem.offsetTop;
    let sibling = tabsElem;
    let stickyElementPadding = 0;

    while (sibling.previousSibling) {
      sibling = sibling.previousSibling;
      const classes = sibling.className;
      if (classes.indexOf('sticky') > -1 && typeof sibling.clientHeight === 'number') {
        // Calculate top padding by checking previous sticky siblings top value and height
        stickyElementPadding += sibling.clientHeight;
      }
    }

    if (isMobile) {
      stickyElementPadding += appBarHeight;
    }
    if (
      typeof stickyElementPadding === 'number'
      && typeof tabsDistanceFromTop === 'number'
      && typeof tabsHeight === 'number'
    ) {
      // Set new styles and scrollDistance value to state
      setStyles({ top: stickyElementPadding });
      setScrollDistance(tabsDistanceFromTop);
    }
  };

  const renderHeader = () => {
    let fullData = [];

    data.forEach((element) => {
      if (element.data && !element.noOrderer) {
        fullData = [...fullData, ...element.data];
      }
    });

    const tabLabelStyles = filteredData.length === 3 && isMobile
      ? `${classes.tabLabelContainer} ${classes.mobileTabFont}`
      : classes.tabLabelContainer;

    let disabled;
    try {
      disabled = filteredData[tabIndex].noOrderer;
    } catch (e) {
      disabled = true;
    }

    return (
      <>
        {
          headerComponents
        }
        {
          fullData.length > 0 && (
            <>
              <ResultOrderer disabled={disabled} />
              <AddressSearchBar
                defaultAddress={userAddress}
                containerClassName={classes.addressBar}
                inputClassName={classes.addressBarInput}
                title={<FormattedMessage id="area.searchbar.infoText.address" />}
                handleAddressChange={address => handleAddressChange(address)}
              />
            </>
          )
        }
        {
          focusClass
          && focusText
          && (
            <Typography variant="srOnly" className={focusClass} tabIndex="-1">{focusText}</Typography>
          )
        }
        <Tabs
          ref={tabsRef}
          className={`sticky ${classes.root}`}
          classes={{
            indicator: classes.indicator,
          }}
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          style={styles}
        >
          {
              filteredData.map((item, index) => {
                if (item.data && item.data.length > 0) {
                  const label = `${item.title} ${item.component ? '' : `(${item.data.length})`}`;
                  const tabId = `${item.title}-${item.data.length}`;
                  return (
                    <Tab
                      id={tabId}
                      key={tabId}
                      aria-controls={`tab-content-${index}`}
                      aria-label={item.ariaLabel ? item.ariaLabel : null}
                      classes={{
                        root: `${classes.tab} ${tabLabelStyles}`,
                        selected: classes.selected,
                      }}
                      className={classes.tab}
                      label={label}
                      onClick={item.onClick ? () => item.onClick(index) : null}
                      focusVisibleClassName={classes.tabFocus}
                    />
                  );
                }
                return (
                  <Tab
                    key={`${item.title}`}
                    aria-controls={`tab-content-${index}`}
                    aria-label={item.ariaLabel ? item.ariaLabel : null}
                    classes={{
                      root: `${classes.tab} ${tabLabelStyles}`,
                      selected: classes.selected,
                    }}
                    label={`${item.title}`}
                    onClick={item.onClick ? () => item.onClick(index) : null}
                    focusVisibleClassName={classes.tabFocus}
                  />
                );
              })
            }
        </Tabs>
      </>
    );
  };

  useEffect(() => {
    calculateHeaderStylings();
  }, [isMobile]);

  const render = () => (
    <>
      {
        renderHeader()
      }

      {
        // Create tab views from data
        filteredData.map((item, index) => {
          // If component given use it instead
          if (item.component) {
            const activeTab = index === tabIndex;
            if (!activeTab) {
              return (
                <div
                  id={`tab-content-${index}`}
                  role="tabpanel"
                  key={item.title}
                  style={{ display: 'none' }}
                >
                  {
                    item.component
                  }
                </div>
              );
            }

            return (
              <div
                className="active"
                id={`tab-content-${index}`}
                role="tabpanel"
                key={item.title}
              >
                {
                  item.component
                }
              </div>
            );
          }


          return (
            <div
              id={`tab-content-${index}`}
              className={classes.resultList}
              key={item.title}
            >
              {
                index === tabIndex
                && (
                  <>
                    <PaginatedList
                      id={`${item.title}-results`}
                      data={item.data}
                      titleComponent="h3"
                      beforePagination={item.beforePagination || null}
                      srTitle={item.title}
                    />
                  </>
                )
              }
            </div>
          );
        })
      }
    </>
  );

  return render();
};

TabLists.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    ariaLabel: PropTypes.string,
    beforePagination: PropTypes.node,
    component: PropTypes.node,
    title: PropTypes.string,
    data: PropTypes.array,
    itemsPerPage: PropTypes.number,
  })).isRequired,
  changeCustomUserLocation: PropTypes.func.isRequired,
  userAddress: PropTypes.objectOf(PropTypes.any),
  headerComponents: PropTypes.objectOf(PropTypes.any),
  onTabChange: PropTypes.func,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  focusClass: PropTypes.string,
  focusText: PropTypes.string,
};

TabLists.defaultProps = {
  headerComponents: null,
  navigator: null,
  userAddress: null,
  focusClass: null,
  focusText: null,
  onTabChange: null,
};

export default TabLists;
