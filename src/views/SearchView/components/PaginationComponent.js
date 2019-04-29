/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  withStyles, Button, Typography,
} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import Container from '../../../components/Container/Container';

// Styles
const styles = theme => ({
  button: {
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
    margin: theme.spacing.unit / 2,
    minWidth: 'auto',
  },
  pageItem: {
    margin: 0,
    marginLeft: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit / 2,
  },
});

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
        textDecoration: isActive ? 'underline' : 'none',
      }}
      role={!isActive ? 'link' : null}
      onClick={!isActive ? onClick : null}
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
    const max = current < maxVisible ? maxVisible : current;

    for (let i = min; i <= max; i += 1) {
      pages.push(
        <PageElement
          className={classes.pageItem}
          key={i}
          number={i}
          intl={intl}
          isActive={current === i}
          onClick={() => { handlePageChange(i); }}
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
              handlePageChange(current - 1);
            }}
            disabled={current === 1}
            color={current !== 1 ? 'primary' : 'default'}
            variant="contained"
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
              handlePageChange(current + 1);
            }}
            disabled={current === pageCount}
            color={current !== pageCount ? 'primary' : 'default'}
            variant="contained"
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

PaginationComponent.defaultProps = {
  maxShownPages: 8,
};

export default withStyles(styles)(injectIntl(PaginationComponent));
