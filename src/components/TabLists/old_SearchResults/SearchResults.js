/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ResultList from '../../Lists/ResultList';
import PaginationComponent from '../PaginationComponent';
import { parseSearchParams, stringifySearchParams } from '../../../utils';

class SearchResults extends React.Component {
  // Options
  // Option to change number of items shown per page
  itemsPerPage = 10;

  develop = false;

  constructor(props) {
    super(props);
    const { currentPage } = props;

    const parsedCurrentPage = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage;
    const pageCount = this.calculatePageCount();

    const newCurrentPage = typeof parsedCurrentPage === 'number' && parsedCurrentPage <= pageCount ? parsedCurrentPage : 1;

    this.state = {
      currentPage: newCurrentPage,
      pageCount,
    };
  }

  // Update only when data changes
  shouldComponentUpdate(nextProps, nextState) {
    const { data } = this.props;
    const { currentPage } = this.state;
    return data !== nextProps.data || currentPage !== nextState.currentPage;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;
    // If page changed focus to first list item
    if (currentPage !== prevState.currentPage) {
      const firstResultListTitleElem = document.querySelectorAll('.Search .SearchResultTitle')[0];
      if (firstResultListTitleElem) {
        firstResultListTitleElem.focus();
      } else {
        console.warn('Focusable element ".Search .SearchResultTitle" is undefined');
      }
    }
  }


  // Handle page number changes
  handlePageChange = (pageNum) => {
    const { history, location } = this.props;
    const { pageCount } = this.state;
    // console.log(pageCount);

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


  // Group data based on object types
  groupData = (data) => {
    const services = data.filter(obj => obj && obj.object_type === 'service');
    const units = data.filter(obj => obj && obj.object_type === 'unit');
    let totalCount = services ? services.length : 0;
    totalCount += units ? units.length : 0;

    return {
      services,
      units,
      totalCount,
    };
  }

  //

  // Calculate pageCount
  calculatePageCount() {
    const { data } = this.props;
    if (data && data.length) {
      const newPageCount = Math.ceil(data.length / this.itemsPerPage);
      return newPageCount;
    }
    return null;
  }

  render() {
    const { data, intl } = this.props;
    const { currentPage, pageCount } = this.state;
    // console.log('Current page: ', currentPage);


    // Group data
    const groupedData = this.groupData(data);
    // console.log('SearchResult groupedData: ', groupedData);

    // Get totals for services and units
    const totalServiceCount = groupedData.services.length;
    const totalUnitCount = groupedData.units.length;

    // Calculate shown data
    const combinedData = [...groupedData.services, ...groupedData.units];
    // console.log('Show combined data: ', combinedData);
    // Figure out splice start and end indexes
    const startIndex = currentPage > 1 ? (currentPage - 1) * this.itemsPerPage : 0;
    const endIndex = combinedData.length >= this.itemsPerPage
      ? currentPage * this.itemsPerPage
      : combinedData.length;
    const shownData = combinedData.slice(startIndex, endIndex);

    const groupedShownData = this.groupData(shownData);

    // console.log('Grouped shown data', groupedShownData);

    const services = groupedShownData
      && groupedShownData.services
      && groupedShownData.services.length > 0
      ? groupedShownData.services
      : false;
    const units = groupedShownData
      && groupedShownData.units
      && groupedShownData.units.length > 0
      ? groupedShownData.units
      : false;

    return (
      <>
        {
          this.develop
          && (
            <ResultList
              listId="develop"
              data={data.slice(0, 20)}
              title="All data (develop)"
              titleComponent="h3"
            />
          )
        }
        {
          services
          && (
            <ResultList
              data={services}
              listId="search-result-services"
              resultCount={totalServiceCount}
              title={intl.formatMessage({ id: 'unit.services' })}
              titleComponent="h3"
            />
          )
        }
        {
          units
          && (
            <ResultList
              data={units}
              listId="search-result-units"
              resultCount={totalUnitCount}
              title={intl.formatMessage({ id: 'unit.plural' })}
              titleComponent="h3"
            />
          )
        }
        <PaginationComponent
          current={currentPage}
          pageCount={pageCount}
          handlePageChange={this.handlePageChange}
        />
      </>
    );
  }
}

SearchResults.propTypes = {
  currentPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

SearchResults.defaultProps = {
  currentPage: 1,
};

export default withRouter(injectIntl(SearchResults));
