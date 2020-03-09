/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Tabs, Tab,
} from '@material-ui/core';
import { intlShape } from 'react-intl';
import isClient, { parseSearchParams, stringifySearchParams, AddEventListener } from '../../utils';
import ResultList from '../Lists/ResultList';
import PaginationComponent from '../PaginationComponent';
import ResultOrderer from './ResultOrderer';
import config from '../../../config';

class TabLists extends React.Component {
  // Options
  events = [];

  // Option to change number of items shown per page
  itemsPerPage = 10;

  tabTitleClass = 'TabResultTitle';

  sidebarClass = 'SidebarWrapper';

  tabsRef = null;

  constructor(props) {
    super(props);
    const { location } = props;
    const searchParams = parseSearchParams(location.search);
    const pageParam = searchParams.p || null;
    const tabParam = searchParams.t || null;

    const parsedCurrentPage = typeof pageParam === 'string' ? parseInt(pageParam, 10) : pageParam;
    const parsedCurrentTab = typeof tabParam === 'string' ? parseInt(tabParam, 10) : tabParam;

    const newCurrentPage = typeof parsedCurrentPage === 'number' ? parsedCurrentPage : 1;
    const newCurrentTab = typeof parsedCurrentTab === 'number' ? parsedCurrentTab : 0;

    this.tabsRef = React.createRef();

    this.state = {
      currentPage: newCurrentPage,
      mobile: false,
      scrollDistance: 0,
      styles: {},
      tabIndex: newCurrentTab,
      tabStyles: {},
    };
  }

  componentDidMount() {
    if (window.innerWidth <= config.mobileUiBreakpoint) {
      this.setState({ mobile: true });
    }
    this.addListeners();
    // Using setTimeout to avoid first calculations on mobile being done
    // with desktop components. Problem seems to be caused by media query hook
    // in Mobile- and DesktopComponent
    setTimeout(() => {
      this.calculateHeaderStylings();
      this.adjustScrollDistance(0);
    }, 500);
  }

  // Update only when data changes
  shouldComponentUpdate(nextProps, nextState) {
    const { data } = this.props;
    const { currentPage, tabIndex, styles } = this.state;
    return data !== nextProps.data
      || currentPage !== nextState.currentPage
      || tabIndex !== nextState.tabIndex
      || styles !== nextState.styles;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;
    // If page changed focus to first list item
    if (currentPage !== prevState.currentPage) {
      const firstListResult = document.querySelectorAll(`.${this.tabTitleClass}`)[0];

      try {
        firstListResult.focus();
      } catch (e) {
        console.error('Unable to focus on list title');
      }
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  // Handle page number changes
  handlePageChange = (pageNum, pageCount) => {
    const { location, navigator } = this.props;

    if (pageNum >= 1 && pageNum <= pageCount) {
      // Change page parameter in searchParams
      const searchParams = parseSearchParams(location.search);
      searchParams.p = pageNum;

      // Get new search search params string
      const searchString = stringifySearchParams(searchParams);
      this.setState({
        currentPage: pageNum,
      });
      // Update p(page) param to current history
      if (navigator) {
        navigator.replace({
          ...location,
          search: `?${searchString || ''}`,
        });
      }
    }
  }

  // Handle tab change
  handleTabChange = (e, value) => {
    // Prevent tab handling for current tab click
    const { tabIndex } = this.state;
    if (tabIndex === value) {
      return;
    }
    const { location, navigator } = this.props;
    // Update p(page) param to current history
    // Change page parameter in searchParams
    const searchParams = parseSearchParams(location.search);
    searchParams.p = 1;
    searchParams.t = value;

    // Get new search search params string
    const searchString = stringifySearchParams(searchParams);

    this.setState({
      currentPage: 1,
      tabIndex: value,
    });

    // Update p(page) param to current history
    if (navigator) {
      navigator.replace({
        ...location,
        search: `?${searchString || ''}`,
      });
    }
    this.adjustScrollDistance();
  }

  adjustScrollDistance(scroll = null) {
    const { scrollDistance } = this.state;

    let scrollDistanceFromTop = scrollDistance;
    const elem = document.getElementsByClassName(this.sidebarClass)[0];
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
  }

  // Add event listeners
  addListeners() {
    if (!isClient()) {
      return;
    }

    const shouldUpdate = mobile => (mobile && window.innerWidth > config.mobileUiBreakpoint)
      || (!mobile && window.innerWidth <= config.mobileUiBreakpoint);

    // Add resize event listener to update header tab styles
    this.events.push(AddEventListener(window, 'resize', () => {
      const { mobile } = this.state;

      // If should update set new state and attempt to run calculations if should still update
      if (shouldUpdate(mobile)) {
        this.setState({ mobile: !mobile }, () => {
          this.calculateHeaderStylings();
        });
      }
    }));
  }

  // Remove all event listeners
  removeListeners() {
    if (!this.events || !this.events.length) {
      return;
    }

    this.events.forEach(unlisten => unlisten());
  }

  calculateHeaderStylings() {
    if (!this.tabsRef) {
      return;
    }
    const { mobile } = this.state;
    // Sticky relation is different on mobile (root relation) and desktop (current content relation)
    const appBarHeight = mobile ? config.topBarHeightMobile : config.topBarHeight;

    // Reset scroll to avoid scrolled sticky  elements having inconsistent offsetTop
    const elem = document.getElementsByClassName(this.sidebarClass)[0];
    elem.scrollTop = 0;

    // Calculate height by looping through Tabs root element's previous siblings
    // Change sidebar scroll to match TabList header's sticky elements' combined height
    const tabsElem = this.tabsRef.tabsRef.parentNode.parentNode;
    const tabsHeight = tabsElem.clientHeight;
    const containerHeight = tabsElem.parentNode.clientHeight;
    const tabsDistanceFromTop = tabsElem.offsetTop;
    let sibling = tabsElem;
    let stickyElementPadding = 0;

    while (sibling.previousSibling) {
      sibling = sibling.previousSibling;
      const classes = sibling.className;
      if (classes.indexOf('sticky') > -1 && typeof sibling.clientHeight === 'number') {
        stickyElementPadding += sibling.clientHeight;
      }
    }

    if (
      typeof stickyElementPadding === 'number'
      && typeof tabsDistanceFromTop === 'number'
      && typeof containerHeight === 'number'
      && typeof tabsHeight === 'number'
    ) {
      // Adjust tabs min height to work with shorter contents
      // const customTabHeight = containerHeight - tabsHeight;
      // Set new styles and scrollDistance value to state
      this.setState({
        styles: {
          // TODO figure better way to calculate top
          top: mobile ? Math.max(appBarHeight, stickyElementPadding) : stickyElementPadding,
        },
        tabStyles: {
          // TODO: disabeld temporarily for causing problems that break the layout
          // minHeight: customTabHeight,
        },
        scrollDistance: (tabsDistanceFromTop - stickyElementPadding),
      });
    }
  }

  // Calculate pageCount
  calculatePageCount(data) {
    if (data && data.length) {
      const newPageCount = Math.ceil(data.length / this.itemsPerPage);
      return newPageCount;
    }
    return null;
  }

  filteredData() {
    const { data } = this.props;
    return data.filter(item => item.component || (item.data && item.data.length > 0));
  }

  renderHeader() {
    const {
      classes, data, headerComponents,
    } = this.props;
    const {
      tabIndex, styles,
    } = this.state;

    let fullData = [];

    data.forEach((element) => {
      if (element.data && !element.noOrderer) {
        fullData = [...fullData, ...element.data];
      }
    });
    const filteredData = this.filteredData();
    return (
      <>
        {
          headerComponents
        }
        {
          fullData.length > 0 && (
            <ResultOrderer disabled={filteredData[tabIndex].noOrderer} />
          )
        }
        <Tabs
          // TODO: In materialUI 4.*
          // Change to use ref and update height calculations in componentDidMount
          innerRef={(ref) => { this.tabsRef = ref; }}
          className={`sticky ${classes.root}`}
          classes={{
            indicator: classes.indicator,
          }}
          value={tabIndex}
          onChange={this.handleTabChange}
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
                        labelContainer: classes.tabLabelContainer,
                        selected: classes.selected,
                      }}
                      className={classes.tab}
                      label={label}
                      onClick={item.onClick || null}
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
                      labelContainer: classes.tabLabelContainer,
                      selected: classes.selected,
                    }}
                    label={`${item.title}`}
                    onClick={item.onClick || null}
                    focusVisibleClassName={classes.tabFocus}
                  />
                );
              })
            }
        </Tabs>
      </>
    );
  }


  render() {
    const {
      classes, intl,
    } = this.props;
    const {
      currentPage, tabIndex, tabStyles,
    } = this.state;

    const filteredData = this.filteredData();

    return (
      <>
        {
          this.renderHeader()
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
                  style={activeTab ? tabStyles : null}
                >
                  {
                    item.component
                  }
                </div>
              );
            }

            // Calculate pageCount and adjust currentPage
            const pageCount = this.calculatePageCount(item.data);
            const adjustedCurrentPage = currentPage > pageCount ? pageCount : currentPage;

            // Calculate shown data
            const endIndex = item.data.length >= this.itemsPerPage
              ? adjustedCurrentPage * this.itemsPerPage
              : item.data.length;
            const startIndex = adjustedCurrentPage > 1
              ? (adjustedCurrentPage - 1) * this.itemsPerPage
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
                      <Typography className={this.tabTitleClass} variant="srOnly" component="p" tabIndex="-1">
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
                        handlePageChange={this.handlePageChange}
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
  }
}

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
  headerComponents: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

TabLists.defaultProps = {
  headerComponents: null,
  navigator: null,
};

export default TabLists;
