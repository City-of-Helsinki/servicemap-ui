/* eslint-disable react/no-multi-comp */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs as MUITabs, Tab,
} from '@material-ui/core';
import { intlShape } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { parseSearchParams, stringifySearchParams } from '../../utils';

const Tabs = ({ classes, data, navigator }) => {
  // Options
  // const events = [];
  const location = useLocation();

  // Option to change number of items shown per page
  // itemsPerPage = 10;

  // tabTitleClass = 'TabResultTitle';

  // sidebarClass = 'SidebarWrapper';

  const [activeTab, setActiveTab] = useState(0);

  const tabsRef = useRef();

  const handleTabChange = (e, value) => {
    // Prevent tab handling for current tab click
    if (activeTab === value) {
      return;
    }
    // Update p(page) param to current history
    // Change page parameter in searchParams
    const searchParams = parseSearchParams(location.search);
    searchParams.p = 1;
    searchParams.t = value;

    // Get new search search params string
    const searchString = stringifySearchParams(searchParams);
    setActiveTab(value);
    /*
    this.setState({
      currentPage: 1,
      tabIndex: value,
    });
*/
    // Update p(page) param to current history
    if (navigator) {
      navigator.replace({
        ...location,
        search: `?${searchString || ''}`,
      });
    }
    // this.adjustScrollDistance();
  };

  const tabContent = data[activeTab] ? data[activeTab].component : null;

  return (
    <>
      <MUITabs
        // TODO: In materialUI 4.*
        // Change to use ref and update height calculations in componentDidMount
        innerRef={tabsRef}
        className={`sticky ${classes.root}`}
        classes={{
          indicator: classes.indicator,
        }}
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        // style={styles}
      >
        {
            data.map(item => (
              <Tab
                key={`${item.title}`}
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
            ))
          }
      </MUITabs>
      {
        tabContent
      }
    </>
  );
};
/*
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
*/

Tabs.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    ariaLabel: PropTypes.string,
    beforePagination: PropTypes.node,
    component: PropTypes.node,
    title: PropTypes.string,
    data: PropTypes.array,
    itemsPerPage: PropTypes.number,
  })).isRequired,
  // headerComponents: PropTypes.objectOf(PropTypes.any),
  // intl: intlShape.isRequired,
  // location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

Tabs.defaultProps = {
  // headerComponents: null,
  navigator: null,
};

export default Tabs;
