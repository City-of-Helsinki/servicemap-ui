/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import UnitItem from '../../ListItems/UnitItem';
import ServiceItem from '../../ListItems/ServiceItem';
import AddressItem from '../../ListItems/AddressItem';
import EventItem from '../../ListItems/EventItem';

class ResultList extends React.Component {
  // Update only when data changes
  shouldComponentUpdate(nextProps) {
    const { data, title } = this.props;
    return (data !== nextProps.data) || (title !== nextProps.title);
  }

  render() {
    const {
      beforeList,
      classes,
      data,
      customComponent,
      listId,
      resultCount,
      title,
      titleComponent,
      embeddedList,
    } = this.props;

    return (
      <div className={classes.root}>
        {
          title
          && (
            <div className={classes.title}>
              <div className={classes.titleContainer}>
                <Typography
                  id={`${listId}-result-title`}
                  className={`${classes.titleText} ${classes.left} SearchResultTitle`}
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
        {!embeddedList ? <Divider aria-hidden="true" /> : null}
        {beforeList}
        <List className={classes.list} id={listId}>
          {
            data && data.length
            && data.map((item) => {
              const { id, object_type, sort_index } = item;
              let itemComponent = null;
              switch (object_type) {
                case 'unit':
                  itemComponent = <UnitItem simpleItem={embeddedList} key={`unit-${id}`} className={`unit-${id}`} unit={item} />;
                  break;
                case 'service':
                  itemComponent = <ServiceItem key={`service-${id}`} service={item} />;
                  break;
                case 'address':
                  itemComponent = <AddressItem key={`address-${sort_index}`} address={item} />;
                  break;
                case 'event':
                  itemComponent = <EventItem key={`event-${item.id}`} event={item} />;
                  break;
                default:
                  if (customComponent && item) {
                    itemComponent = customComponent(item);
                  } else {
                    itemComponent = null;
                  }
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
  beforeList: PropTypes.node,
  classes: PropTypes.objectOf(PropTypes.any),
  customComponent: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  listId: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  embeddedList: PropTypes.bool,
};

ResultList.defaultProps = {
  beforeList: null,
  classes: {},
  customComponent: null,
  resultCount: null,
  title: null,
  embeddedList: false,
};
