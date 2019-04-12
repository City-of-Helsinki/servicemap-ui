import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import ResultItem from './ResultItem';
import { drawIcon } from '../../views/Map/utils/drawIcon';

const styles = theme => ({
  root: {
    height: 'auto',
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  title: {
    width: '100%',
  },
  left: {
    float: 'left',
    margin: theme.spacing.unit,
  },
  right: {
    float: 'right',
    margin: theme.spacing.unit,
  },
  list: {
    maxHeight: '100%',
  },
});

class ResultList extends React.Component {
  // Update only when data changes
  shouldComponentUpdate(nextProps) {
    const { data, title } = this.props;
    return (data !== nextProps.data) || (title !== nextProps.title);
  }

  render() {
    const {
      classes, data, listId, onItemClick, title,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography
              id={`${listId}-result-title`}
              className={classes.left}
              component="h3"
              variant="subtitle1"
              aria-labelledby={`${listId}-result-title ${listId}-result-title-info`}
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
              <FormattedMessage id="search.results" values={{ count: data.length }} />
            </Typography>
          </div>
        </div>
        <Divider />
        <List className={classes.list} id={listId}>
          {
            data && data.length
            && data.map((item) => {
              // eslint-disable-next-line camelcase
              const { id, object_type } = item;
              // Figure out correct icon for item
              let icon = null;
              // eslint-disable-next-line camelcase
              switch (object_type) {
                case 'unit':
                  icon = <img alt="" src={drawIcon(item, null, true)} style={{ height: 24 }} aria-hidden="true" />;
                  break;
                case 'service':
                  icon = <Menu />;
                  break;
                default:
                  icon = false;
              }
              if (item) {
                return (
                  <ResultItem
                    key={`${id}`}
                    onClick={(e) => {
                      onItemClick(e, item);
                    }}
                    data={item}
                    icon={icon}
                    listId={listId}
                  />
                );
              }
              return null;
            })
          }
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(ResultList);

// Typechecking
ResultList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  listId: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

ResultList.defaultProps = {
  classes: {},
};
