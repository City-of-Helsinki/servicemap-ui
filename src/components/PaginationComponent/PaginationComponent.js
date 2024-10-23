/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowForwardIos } from '@mui/icons-material';
import styled from '@emotion/styled';
import Container from '../Container';
import PageElement from './PageElement';
import SMButton from '../ServiceMapButton';

class PaginationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      current,
      handlePageChange,
      intl,
      maxShownPages = 7,
      pageCount,
      embeddedList = false,
    } = this.props;

    // Return if only 1 page
    if (pageCount === 1) {
      return null;
    }

    const pages = [];
    const maxVisible = pageCount < maxShownPages ? pageCount : maxShownPages;
    const min = current > maxShownPages ? current - maxShownPages + 1 : 1;
    let max = current < maxVisible ? maxVisible : (current + 1);
    max = max > pageCount ? pageCount : max; // Don't allow anything above total page count

    for (let i = min; i <= max; i += 1) {
      pages.push(
        <PageElement
          key={i}
          number={i}
          isActive={current === i}
          onClick={() => { handlePageChange(i, pageCount); }}
        />,
      );
    }
    return (
      <ButtonContainer data-sm="PaginationComponent">
        {
          // Button backwards one page
          <StyledButtonFlipped
            id="PaginationPreviousButton"
            aria-label={intl.formatMessage({ id: 'general.pagination.previous' })}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current - 1, pageCount);
            }}
            disabled={current === 1}
            color={current !== 1 ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <StyledArrowForwardIos />
          </StyledButtonFlipped>
        }
        {
          // Button forward one page
          <StyledButton
            id="PaginationNextButton"
            aria-label={intl.formatMessage({ id: 'general.pagination.next' })}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current + 1, pageCount);
            }}
            disabled={current === pageCount}
            color={current !== pageCount ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <StyledArrowForwardIos />
          </StyledButton>
        }
        {
          // Page numbers
          !embeddedList
            ? (
              <StyledListContainer>
                <StyledList>
                  {pages}
                </StyledList>
              </StyledListContainer>
            )
            : null
        }
      </ButtonContainer>
    );
  }
}

const StyledList = styled('ul')(() => ({
  display: 'inherit',
  flexDirection: 'row',
  listStyleType: 'none',
  margin: 0,
  padding: 0,
}));

const StyledListContainer = styled(Container)(() => ({
  flexDirection: 'row',
  margin: 0,
}));

const StyledArrowForwardIos = styled(ArrowForwardIos)(() => ({
  fontSize: 18,
}));

const StyledButton = styled(SMButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  height: 32,
  width: 32,
  minHeight: 32,
  minWidth: 32,
  border: '1px solid #000000',
}));

const StyledButtonFlipped = styled(StyledButton)(() => ({
  transform: 'scaleX(-1)',
}));

const ButtonContainer = styled(Container)(({ theme }) => ({
  flexDirection: 'row',
  margin: theme.spacing(1, 2),
  padding: theme.spacing(0.5),
}));

PaginationComponent.propTypes = {
  current: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  maxShownPages: PropTypes.number,
  pageCount: PropTypes.number.isRequired,
  embeddedList: PropTypes.bool,
};

export default PaginationComponent;
