/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import { parseSearchParams, stringifySearchParams, focusToViewTitle } from '../../utils';
import ResultList from '../Lists/ResultList';
import PaginationComponent from '../../views/SearchView/components/PaginationComponent';

class TabLists extends React.Component {
  // Options
  // Option to change number of items shown per page
  itemsPerPage = 10;

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

    this.state = {
      currentPage: newCurrentPage,
      tabIndex: newCurrentTab,
    };
  }

  // Update only when data changes
  shouldComponentUpdate(nextProps, nextState) {
    const { data } = this.props;
    const { currentPage, tabIndex } = this.state;
    return data !== nextProps.data
      || currentPage !== nextState.currentPage
      || tabIndex !== nextState.tabIndex;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;
    // If page changed focus to first list item
    if (currentPage !== prevState.currentPage) {
      const firstListResult = document.querySelectorAll('.Search .TabResultTitle')[0];

      try {
        firstListResult.focus();
      } catch (e) {
        // If TabResultTitle can't be found focus to view title
        focusToViewTitle();
      }
    }
  }


  // Handle page number changes
  handlePageChange = (pageNum, pageCount) => {
    const { history, location } = this.props;

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
      history.replace({
        ...location,
        search: `?${searchString || ''}`,
      });
    }
  }

  // Handle tab change
  handleTabChange = (e, value) => {
    // Update p(page) param to current history
    const { history, location } = this.props;

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
    history.replace({
      ...location,
      search: `?${searchString || ''}`,
    });
  }

  // Calculate pageCount
  calculatePageCount(data) {
    if (data && data.length) {
      const newPageCount = Math.ceil(data.length / this.itemsPerPage);
      return newPageCount;
    }
    return null;
  }


  render() {
    const { data, intl } = this.props;
    const { currentPage, tabIndex } = this.state;

    return (
      <>
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {
            data.map(item => (
              item.data
              && item.data.length > 0
              && <Tab key={`${item.title} (${item.data.length})`} label={`${item.title} ${item.component ? '' : `(${item.data.length})`}`} aria-label={item.ariaLabel ? item.ariaLabel : null} />
            ))
          }
        </Tabs>
        {
          // Create tab views from data
          data.map((item, index) => {
            // If component given use it instead
            if (item.component) {
              return (
                <div key={item.title}>
                  {
                    index === tabIndex
                    && item.component
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

            return (
              <div key={item.title}>
                {
                  index === tabIndex
                  && (
                    <>
                      {
                        // Hide title if no pagination used
                        pageCount > 1
                        && (
                          <Typography className="TabResultTitle" variant="srOnly" component="h3" tabIndex="-1">
                            {`${item.title} ${intl.formatMessage({ id: 'general.pagination.pageCount' }, { current: adjustedCurrentPage, max: pageCount })}`}
                          </Typography>

                        )
                      }
                      <ResultList
                        data={shownData}
                        listId={`${item.title}-results`}
                        resultCount={item.data.length}
                        titleComponent="h3"
                      />
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
  data: PropTypes.arrayOf(PropTypes.shape({
    ariaLabel: PropTypes.string,
    component: PropTypes.node,
    title: PropTypes.string,
    data: PropTypes.array,
    itemsPerPage: PropTypes.number,
  })).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(withRouter(TabLists));
