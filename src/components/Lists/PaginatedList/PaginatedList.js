/* eslint-disable react/no-multi-comp */
import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { selectNavigator } from '../../../redux/selectors/general';
import { parseSearchParams, stringifySearchParams } from '../../../utils';
import PaginationComponent from '../../PaginationComponent';
import ResultList from '../ResultList';

function PaginatedList({
  beforePagination = null,
  customComponent = null,
  data,
  id,
  itemsPerPage = 10,
  srTitle = null,
  title = null,
  titleComponent,
  embeddedList = null,
}) {
  const navigator = useSelector(selectNavigator);
  const location = useLocation();
  const searchPageNum = parseInt(
    new URLSearchParams(location.search).get('p'),
    10
  ); // Get query parameter
  const defaultPageNum = !Number.isNaN(searchPageNum) ? searchPageNum : 1;
  const [currentPage, setCurrentPage] = useState(defaultPageNum);
  const [windowHeight, setWindowHeight] = useState(0);
  const intl = useIntl();
  const focusTarget = useRef();
  const isFirstRun = useRef(true);

  let itemCount = itemsPerPage;

  if (embeddedList) {
    // Handle embedded list size dynamically based on screen height
    const listItemHeight = 38;
    const offsetHeight = embeddedList === 'bottom' ? 48 : 100;
    const listHeight = windowHeight - offsetHeight;
    itemCount = Math.max(3, Math.floor(listHeight / listItemHeight));
  }

  // Track window size change on embedded list view
  useEffect(() => {
    const updateSize = () => {
      const listContainerSize =
        document.getElementById('unitListContainer')?.clientHeight;
      setWindowHeight(listContainerSize || window.innerHeight);
    };
    if (embeddedList) {
      window.addEventListener('resize', updateSize);
      updateSize();
    }
    return () => window.removeEventListener('resize', updateSize);
  }, [embeddedList]);

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
      return Math.ceil(data.length / itemCount);
    }
    return null;
  };

  const pageCount = calculatePageCount(data);
  const adjustedCurrentPage = currentPage > pageCount ? pageCount : currentPage;

  // Calculate shown data
  const endIndex =
    data.length >= itemCount ? adjustedCurrentPage * itemCount : data.length;
  const startIndex =
    adjustedCurrentPage > 1 ? (adjustedCurrentPage - 1) * itemCount : 0;
  const shownData = data.slice(startIndex, endIndex);
  const additionalText = intl.formatMessage(
    { id: 'general.pagination.pageCount' },
    { current: adjustedCurrentPage, max: pageCount }
  );
  const beforeList = (
    <Typography
      id="PaginatedListFocusTarget"
      ref={focusTarget}
      style={visuallyHidden}
      component="p"
      tabIndex="-1"
    >
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
        embeddedList={!!embeddedList}
      />
      {beforePagination || null}
      {data.length > 0 && (
        <PaginationComponent
          current={adjustedCurrentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          embeddedList={!!embeddedList}
        />
      )}
    </>
  );
}

PaginatedList.propTypes = {
  beforePagination: PropTypes.node,
  customComponent: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  id: PropTypes.string.isRequired,
  itemsPerPage: PropTypes.number,
  srTitle: PropTypes.string,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    .isRequired,
  embeddedList: PropTypes.string,
};

export default PaginatedList;
