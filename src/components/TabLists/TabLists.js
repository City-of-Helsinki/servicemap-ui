/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs, Tab, Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { css } from '@emotion/css';
import { useTheme } from '@mui/styles';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { selectNavigator } from '../../redux/selectors/general';
import { parseSearchParams, stringifySearchParams } from '../../utils';
import ResultOrderer from '../ResultOrderer';
import config from '../../../config';
import useMobileStatus from '../../utils/isMobile';
import PaginatedList from '../Lists/PaginatedList';

function TabLists({
  location,
  data,
  onTabChange,
  focusClass,
  focusText,
  headerComponents,
}) {
  const isMobile = useMobileStatus();
  const theme = useTheme();
  const navigator = useSelector(selectNavigator);
  const searchParams = parseSearchParams(location.search);
  const filteredData = data.filter(item => item.component || (item.data && item.data.length > 0));
  const getTabfromUrl = () => {
    let index = filteredData.findIndex(tab => tab.id === searchParams.t);
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

    if (filteredData[value].id) {
      searchParams.t = filteredData[value].id;
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
    if (elem) elem.scrollTop = 0;

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

    data.forEach(element => {
      if (element.data && !element.noOrderer) {
        fullData = [...fullData, ...element.data];
      }
    });

    const tabClassResolver = () => {
      const styles = {};
      // tab
      Object.assign(styles, {
        minWidth: 0,
        fontWeight: 'normal',
        flex: '1 1',
        [theme.breakpoints.only('sm')]: {
          letterSpacing: 'normal',
        },
        color: 'black',
        '&:focus': {
          boxShadow: 'none',
          zIndex: 0,
        },
      });
      // tabLabelContainer
      Object.assign(styles, {
        padding: theme.spacing(1),
        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
        overflowWrap: 'normal',
      });
      if (filteredData.length === 3 && isMobile) {
        // Mobilefont
        Object.assign(styles, {
          fontSize: '0.719rem',
        });
      }
      return styles;
    };
    const tabRootClass = css(tabClassResolver());
    const selectedClass = css({
      fontWeight: '700 !important',
      color: `${theme.palette.primary.main} !important`,
    });
    const tabFocusClass = css({
      outline: `4px solid ${theme.palette.primary.highContrast} !important`,
      outlineOffset: -1,
      boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder.main} !important`,
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    });

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
            <ResultOrderer disabled={disabled} />
          )
        }
        {
          focusClass
          && focusText
          && (
            <Typography style={visuallyHidden} className={focusClass} tabIndex={-1}>
              {focusText}
            </Typography>
          )
        }
        <StyledTabs
          ref={tabsRef}
          className="sticky"
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          style={styles}
        >
          {
            filteredData.map((item, index) => {
              if (item.data && item.data.length > 0) {
                const label = `${item.title} ${item.component ? '' : `(${item.data.length})`}`.trim();
                const tabId = `${item.title}-${item.data.length}`;

                return (
                  <StyledTab
                    id={tabId}
                    key={tabId}
                    ref={item.ref}
                    aria-controls={`tab-content-${index}`}
                    aria-label={item.ariaLabel ? item.ariaLabel : null}
                    classes={{
                      root: tabRootClass,
                      selected: selectedClass,
                    }}
                    label={label}
                    onClick={item.onClick ? () => item.onClick(index) : null}
                    focusVisibleClassName={tabFocusClass}
                  />
                );
              }
              return (
                <Tab
                  id={`Tab${index}`}
                  key={`${item.title}`}
                  ref={item.ref}
                  aria-controls={`tab-content-${index}`}
                  aria-label={item.ariaLabel ? item.ariaLabel : null}
                  classes={{
                    root: tabRootClass,
                    selected: selectedClass,
                  }}
                  label={`${item.title}`}
                  onClick={item.onClick ? () => item.onClick(index) : null}
                  focusVisibleClassName={tabFocusClass}
                />
              );
            })
          }
        </StyledTabs>
      </>
    );
  };

  useEffect(() => {
    calculateHeaderStylings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    // Change tab if selected tab is changed on url
    const tabFromUrl = getTabfromUrl();
    if (tabFromUrl !== tabIndex) {
      handleTabChange(null, tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
            <StyledResultListContainer
              id={`tab-content-${index}`}
              key={item.title}
            >
              {
                index === tabIndex
                && (
                  <PaginatedList
                    id={`${item.title}-results`}
                    data={item.data}
                    titleComponent="h3"
                    beforePagination={item.beforePagination || null}
                    srTitle={item.title}
                  />
                )
              }
            </StyledResultListContainer>
          );
        })
      }
    </>
  );

  return render();
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  position: 'sticky',
  zIndex: theme.zIndex.sticky,
  backgroundColor: theme.palette.white.main,
  borderColor: theme.palette.white.contrastText,
  color: theme.palette.white.contrastText,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: 0,
  fontWeight: 'normal',
  flex: '1 1',
  [theme.breakpoints.only('sm')]: {
    letterSpacing: 'normal',
  },
  color: 'black',
  '&:focus': {
    boxShadow: 'none',
    zIndex: 0,
  },
}));

const StyledResultListContainer = styled('div')(() => ({
  backgroundColor: 'white',
}));

TabLists.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    ariaLabel: PropTypes.string,
    beforePagination: PropTypes.node,
    component: PropTypes.node,
    title: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.any),
    itemsPerPage: PropTypes.number,
  })).isRequired,
  headerComponents: PropTypes.objectOf(PropTypes.any),
  onTabChange: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  focusClass: PropTypes.string,
  focusText: PropTypes.string,
};

TabLists.defaultProps = {
  onTabChange: null,
  focusClass: null,
  focusText: null,
  headerComponents: null,
};

export default TabLists;
