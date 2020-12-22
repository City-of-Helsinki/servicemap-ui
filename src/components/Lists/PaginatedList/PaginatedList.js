/* eslint-disable react/no-multi-comp */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import ResultList from '../ResultList';
import PaginationComponent from '../../PaginationComponent';
import { parseSearchParams, stringifySearchParams } from '../../../utils';

const PaginatedList = ({
  customComponent,
  data,
  id,
  itemsPerPage,
  navigator,
  srTitle,
  title,
  titleComponent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const intl = useIntl();
  const focusTarget = useRef();
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Prevent focusing on component mount
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      if (focusTarget.current) {
        focusTarget.current.focus();
      }
    } catch (e) {
      console.error('Unable to focus on list title');
    }
  }, [currentPage]);

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
  const additionalText = `${intl.formatMessage({ id: 'general.pagination.pageCount' }, { current: adjustedCurrentPage, max: pageCount })}`;
  const beforeList = (
    <Typography innerRef={focusTarget} variant="srOnly" component="p" tabIndex="-1">
      {`${srTitle || ''} ${additionalText}`}
    </Typography>
  );

  return (
    <>
      <ResultList
        beforeList={beforeList}
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
  itemsPerPage: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
  srTitle: PropTypes.string,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

PaginatedList.defaultProps = {
  customComponent: null,
  itemsPerPage: 10,
  navigator: null,
  srTitle: null,
  title: null,
};

export default PaginatedList;
