/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import UnitItem from '../../ListItems/UnitItem';
import ServiceItem from '../../ListItems/ServiceItem';

class ResultList extends React.Component {
  // Update only when data changes
  shouldComponentUpdate(nextProps) {
    const { data, title } = this.props;
    return (data !== nextProps.data) || (title !== nextProps.title);
  }

  render() {
    const {
      classes, data, listId, resultCount, title, titleComponent,
    } = this.props;

    return (
      <div className={classes.root}>
        {
          title
          && (
            <div className={classes.title}>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  id={`${listId}-result-title`}
                  className={`${classes.left} SearchResultTitle`}
                  component={titleComponent}
                  variant="subtitle1"
                  aria-labelledby={`${listId}-result-title ${listId}-result-title-info`}
                  tabIndex="-1"
                >
                  {title}

                </Typography>
                <Typography
                  id={`${listId}-result-title-info`}
                  className={classes.right}
                  component="p"
                  variant="caption"
                  aria-hidden="true"
                >
                  <FormattedMessage id="search.resultList" values={{ count: resultCount || data.length }} />
                </Typography>
              </div>
            </div>
          )
        }
        <Divider aria-hidden="true" />
        <List className={classes.list} id={listId}>
          {
            data && data.length
            && data.map((item) => {
              const { id, object_type } = item;
              // Figure out correct icon for item
              let itemComponent = null;
              switch (object_type) {
                case 'unit':
                  itemComponent = <UnitItem key={`unit-${id}`} unit={item} listId={listId} />;
                  break;
                case 'service':
                  itemComponent = <ServiceItem key={`service-${id}`} service={item} />;
                  break;
                default:
                  itemComponent = null;
              }
              if (item) {
                return itemComponent;
              }
              return null;
            })
          }
        </List>
      </div>
    );
  }
}

export default ResultList;

// Typechecking
ResultList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  listId: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

ResultList.defaultProps = {
  classes: {},
  resultCount: null,
  title: null,
  titleComponent: 'h3',
};
