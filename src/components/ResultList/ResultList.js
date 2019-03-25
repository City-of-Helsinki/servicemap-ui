import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import ResultItem from './ResultItem';

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
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.5,
  },
  right: {
    float: 'right',
    margin: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.7,
  },
  list: {
    maxHeight: '100%',
  },
});

class ResultList extends React.Component {
  // Update only when data changes
  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return (data !== nextProps.data);
  }

  render() {
    const {
      classes, data, onItemClick, title,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <div style={{
            width: '100%',
            overflow: 'hidden',
          }}
          >
            <Typography className={classes.left} variant="h3">{title}</Typography>
            <Typography className={classes.right} variant="subtitle1">{`${data.length} osumaa`}</Typography>
          </div>
        </div>
        <Divider />
        <List className={classes.list}>
          {
            data && data.length
            && data.map((item) => {
              const { id } = item;
              if (item) {
                return (
                  <ResultItem
                    key={`${id}`}
                    onClick={(e) => {
                      onItemClick(e, item);
                    }}
                    data={item}
                    icon={<Menu />}
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
  onItemClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

ResultList.defaultProps = {
  classes: {},
};
