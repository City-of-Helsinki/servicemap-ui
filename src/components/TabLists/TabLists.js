/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Tabs, Tab,
} from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import { parseSearchParams, stringifySearchParams } from '../../utils';
import ResultList from '../Lists/ResultList';
import PaginationComponent from '../PaginationComponent';
import ResultOrderer from '../ResultOrderer';
import config from '../../../config';
import useMobileStatus from '../../utils/isMobile';
import AddressSearchBar from '../AddressSearchBar';

const TabLists = ({
  changeCustomUserLocation, location, data, headerComponents, navigator, classes, intl, userAddress,
}) => {
  // Option to change number of items shown per page
  const itemsPerPage = 10;

  const isMobile = useMobileStatus();

  const searchParams = parseSearchParams(location.search);
  const getPagefromUrl = () => parseInt(searchParams.p, 10) || 1;
  const getTabfromUrl = () => parseInt(searchParams.t, 10) || 0;

  const tabTitleClass = 'TabResultTitle';
  const sidebarClass = 'SidebarWrapper';

  const [currentPage, setCurrentPage] = useState(getPagefromUrl());
  const [scrollDistance, setScrollDistance] = useState(0);
  const [tabIndex, setTabIndex] = useState(getTabfromUrl());
  const [styles, setStyles] = useState({});

  let tabsRef = useRef(null);

  const filteredData = data.filter(item => item.component || (item.data && item.data.length > 0));

  // Handle page number changes
  const handlePageChange = (pageNum, pageCount) => {
    if (pageNum >= 1 && pageNum <= pageCount) {
      // Change page parameter in searchParams
      const searchParams = parseSearchParams(location.search);
      searchParams.p = pageNum;

      // Get new search search params string
      const searchString = stringifySearchParams(searchParams);
      setCurrentPage(pageNum);
      // Update p(page) param to current history
      if (navigator) {
        navigator.replace({
          ...location,
          search: `?${searchString || ''}`,
        });
      }
    }
  };


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
    // Update p(page) param to current history
    // Change page parameter in searchParams
    const searchParams = parseSearchParams(location.search);
    searchParams.p = 1;
    searchParams.t = value;

    // Get new search search params string
    const searchString = stringifySearchParams(searchParams);
    setCurrentPage(1);
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
    if (!tabsRef) {
      return;
    }
    // Sticky relation is different on mobile (root relation) and desktop (current content relation)
    const appBarHeight = isMobile ? config.topBarHeightMobile : config.topBarHeight;

    // Reset scroll to avoid scrolled sticky  elements having inconsistent offsetTop
    const elem = document.getElementsByClassName(sidebarClass)[0];
    elem.scrollTop = 0;

    // Calculate height by looping through Tabs root element's previous siblings
    // Change sidebar scroll to match TabList header's sticky elements' combined height
    const tabsElem = tabsRef.tabsRef.parentNode.parentNode;
    const tabsHeight = tabsElem.clientHeight;
    const tabsDistanceFromTop = tabsElem.offsetTop;
    let sibling = tabsElem;
    let stickyElementPadding = 0;

    while (sibling.previousSibling) {
      sibling = sibling.previousSibling;
      const classes = sibling.className;
      if (classes.indexOf('sticky') > -1 && typeof sibling.clientHeight === 'number') {
        // Calculate top padding by checking previous sticky siblings top value and height
        stickyElementPadding += parseInt(getComputedStyle(sibling).top, 10);
        stickyElementPadding += sibling.clientHeight;
      }
    }

    if (isMobile && stickyElementPadding === 0) {
      stickyElementPadding = appBarHeight;
    }

    if (
      typeof stickyElementPadding === 'number'
      && typeof tabsDistanceFromTop === 'number'
      && typeof tabsHeight === 'number'
    ) {
      // Set new styles and scrollDistance value to state
      setStyles({ top: stickyElementPadding });
      setScrollDistance(tabsDistanceFromTop - stickyElementPadding);
    }
  };

  // Calculate pageCount
  const calculatePageCount = (data) => {
    if (data && data.length) {
      const newPageCount = Math.ceil(data.length / itemsPerPage);
      return newPageCount;
    }
    return null;
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

    return (
      <>
        {
          headerComponents
        }
        {
          fullData.length > 0 && (
            <>
              <ResultOrderer disabled={filteredData[tabIndex].noOrderer} />
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
        <Tabs
          // TODO: In materialUI 4.*
          // Change to use ref and update height calculations in componentDidMount
          innerRef={(ref) => { tabsRef = ref; }}
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
                        root: classes.tab,
                        labelContainer: tabLabelStyles,
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
                      root: classes.tab,
                      labelContainer: tabLabelStyles,
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

  useEffect(() => {
    const firstListResult = document.querySelectorAll(`.${tabTitleClass}`)[0];
    if (firstListResult) {
      try {
        firstListResult.focus();
      } catch (e) {
        console.error('Unable to focus on list title');
      }
    }
  }, [currentPage]);


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
                  />
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

            // Calculate pageCount and adjust currentPage
            const pageCount = calculatePageCount(item.data);
            const adjustedCurrentPage = currentPage > pageCount ? pageCount : currentPage;

            // Calculate shown data
            const endIndex = item.data.length >= itemsPerPage
              ? adjustedCurrentPage * itemsPerPage
              : item.data.length;
            const startIndex = adjustedCurrentPage > 1
              ? (adjustedCurrentPage - 1) * itemsPerPage
              : 0;
            const shownData = item.data.slice(startIndex, endIndex);

            const additionalText = `${intl.formatMessage({ id: 'general.pagination.pageCount' }, { current: adjustedCurrentPage, max: pageCount })}`;

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
                      <Typography className={tabTitleClass} variant="srOnly" component="p" tabIndex="-1">
                        {`${item.title} ${additionalText}`}
                      </Typography>
                      <ResultList
                        data={shownData}
                        listId={`${item.title}-results`}
                        resultCount={item.data.length}
                        titleComponent="h3"
                      />
                      {
                        item.beforePagination || null
                      }
                      <PaginationComponent
                        current={adjustedCurrentPage}
                        pageCount={pageCount}
                        handlePageChange={handlePageChange}
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
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

TabLists.defaultProps = {
  headerComponents: null,
  navigator: null,
  userAddress: null,
};

export default TabLists;
