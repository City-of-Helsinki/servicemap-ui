/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowForwardIos } from '@material-ui/icons';
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
      classes, current, handlePageChange, intl, maxShownPages, pageCount, embeddedList,
    } = this.props;

    // Return if only 1 page
    if (pageCount === 1) {
      return null;
    }

    const buttonClass = classes.borderBlack;

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
      <Container className={classes.buttonContainer}>
        {
          // Button backwards one page
          <SMButton
            aria-label={intl.formatMessage({ id: 'general.pagination.previous' })}
            className={`${classes.button} ${classes.arrowFlip} ${buttonClass}`}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current - 1, pageCount);
            }}
            disabled={current === 1}
            color={current !== 1 ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <ArrowForwardIos className={classes.arrowIcon} />
          </SMButton>
        }
        {
          // Button forward one page
          <SMButton
            aria-label={intl.formatMessage({ id: 'general.pagination.next' })}
            className={`${classes.button} ${buttonClass}`}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current + 1, pageCount);
            }}
            disabled={current === pageCount}
            color={current !== pageCount ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <ArrowForwardIos className={classes.arrowIcon} />
          </SMButton>
        }
        {
          // Page numbers
          !embeddedList
            ? (
              <Container className={classes.listContainer}>
                <ul className={classes.list}>
                  {pages}
                </ul>
              </Container>
            )
            : null
        }
      </Container>
    );
  }
}

PaginationComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  current: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  maxShownPages: PropTypes.number,
  pageCount: PropTypes.number.isRequired,
  embeddedList: PropTypes.bool,
};

// Default props
PaginationComponent.defaultProps = {
  maxShownPages: 7,
  embeddedList: false,
};

export default PaginationComponent;
