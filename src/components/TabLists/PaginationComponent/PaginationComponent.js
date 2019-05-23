/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  withStyles, Button, Typography,
} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import Container from '../../Container/Container';
import { keyboardHandler } from '../../../utils';
import styles from './styles';

// Page number element
const PageElement = ({
  intl, isActive, number, onClick, ...rest
}) => (
  <li>
    <Typography
      variant="subtitle1"
      component="p"
      style={{
        color: isActive ? 'red' : 'black',
        cursor: isActive ? 'auto' : 'pointer',
        textDecoration: isActive ? 'underline' : 'none',
      }}
      role={!isActive ? 'link' : null}
      onClick={!isActive ? onClick : null}
      onKeyPress={!isActive ? keyboardHandler(onClick, ['space', 'enter']) : null}
      tabIndex={isActive ? null : '0'}
      {...rest}
    >
      <Typography variant="srOnly">
        {
          isActive
            ? intl.formatMessage({ id: 'general.pagination.currentlyOpenedPage' }, { count: number })
            : intl.formatMessage({ id: 'general.pagination.openPage' }, { count: number })
        }
      </Typography>
      <span aria-hidden="true">
        {number}
      </span>
    </Typography>
  </li>

);

PageElement.propTypes = {
  intl: intlShape.isRequired,
  isActive: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};


class PaginationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      classes, current, handlePageChange, intl, maxShownPages, pageCount,
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
          className={classes.pageItem}
          key={i}
          number={i}
          intl={intl}
          isActive={current === i}
          onClick={() => { handlePageChange(i, pageCount); }}
        />,
      );
    }
    return (
      <Container style={{ flexDirection: 'row' }}>
        {
          // Button backwards one page
          <Button
            aria-label={intl.formatMessage({ id: 'general.pagination.previous' })}
            className={classes.button}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current - 1, pageCount);
            }}
            disabled={current === 1}
            color={current !== 1 ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <ArrowBackIos />
          </Button>
        }
        {
          // Button forward one page
          <Button
            aria-label={intl.formatMessage({ id: 'general.pagination.next' })}
            className={classes.button}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current + 1, pageCount);
            }}
            disabled={current === pageCount}
            color={current !== pageCount ? 'primary' : 'default'}
            variant="contained"
            role="link"
          >
            <ArrowForwardIos />
          </Button>
        }
        {
          // Page numbers
          <Container style={{ flexDirection: 'row', margin: 0 }}>
            <ul style={{
              display: 'inherit',
              flexDirection: 'row',
              listStyleType: 'none',
              margin: 0,
              padding: 0,
            }}
            >
              {pages}
            </ul>
          </Container>
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
};

// Default props
PaginationComponent.defaultProps = {
  maxShownPages: 7,
};

export default withStyles(styles)(injectIntl(PaginationComponent));
