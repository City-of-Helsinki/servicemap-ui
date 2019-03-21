import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import SearchItem from './SearchItem';

const styles = {
  root: {
    fontSize: '1rem',
  },
  text: {
    fontSize: '1rem',
  },
  list: {
    maxHeight: '100%',
  },
};

const SearchList = (props) => {
  const {
    data, match, classes,
  } = props;
  const { params } = match;
  const lng = params && params.lng;

  return (
    <div className="SearchList">
      <List className={classes.list}>
        {
          data && data.length
          // TODO: Check duplicate keys error with big datasets
          && data.map((item) => {
            const { id } = item;
            if (item) {
              return (
                <SearchItem
                  key={`${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const { history } = props;
                    if (history) {
                      history.push(`/${lng || 'fi'}/unit/${id}/`);
                    }
                  }}
                  data={item}
                />
              );
            }
            return null;
          })
        }
      </List>
    </div>
  );
};

export default withStyles(styles)(withRouter(SearchList));

// Typechecking
SearchList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  match: PropTypes.objectOf(PropTypes.any),
};

SearchList.defaultProps = {
  classes: {},
  data: [],
  match: {},
};
