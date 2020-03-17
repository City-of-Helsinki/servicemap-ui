/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import ResultList from '../ResultList';
import PaginationComponent from '../../PaginationComponent';
import { parseSearchParams, stringifySearchParams } from '../../../utils';

const PaginatedList = ({
  customComponent,
  data,
  id,
  navigator,
  title,
  titleComponent,
}) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  if (!data.length) {
    return null;
  }

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

  // Calculate pageCount
  const calculatePageCount = (data) => {
    if (data && data.length) {
      const newPageCount = Math.ceil(data.length / itemsPerPage);
      return newPageCount;
    }
    return null;
  };

  const pageCount = calculatePageCount(data);
  const adjustedCurrentPage = currentPage > pageCount ? pageCount : currentPage;

  // Calculate shown data
  const endIndex = data.length >= itemsPerPage
    ? adjustedCurrentPage * itemsPerPage
    : data.length;
  const startIndex = adjustedCurrentPage > 1
    ? (adjustedCurrentPage - 1) * itemsPerPage
    : 0;
  const shownData = data.slice(startIndex, endIndex);

  return (
    <>
      <ResultList
        data={shownData}
        listId={`paginatedList-${id}`}
        resultCount={data.length}
        title={title}
        titleComponent={titleComponent}
        customComponent={customComponent}
      />
      {
        data.length > 0
        && (
          <PaginationComponent
            current={adjustedCurrentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        )
      }
    </>
  );
};

PaginatedList.propTypes = {
  customComponent: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  id: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

PaginatedList.defaultProps = {
  customComponent: null,
  navigator: null,
  title: null,
};

export default PaginatedList;
