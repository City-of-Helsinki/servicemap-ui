/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import LinkListItem from './LinkListItem';
import listStyles from '../styles/listStyles';

const LinkList = (props) => {
  const { classes, data, title } = props;
  if (data.length > 0) {
    const filteredData = data.filter(item => Object.keys(item).length > 0);

    // Assign id for each item
    for (let i = 0; i < filteredData.length; i += 1) {
      filteredData[i].id = i;
    }

    return (
      <div>
        <Typography className={classes.title} variant="h3">{title}</Typography>
        <List>
          {filteredData.map(data => (
            <div key={data.type + data.id}>
              <LinkListItem data={data} />
              <Divider className={classes.divider} />
            </div>
          ))}
        </List>
      </div>
    );
  }
  return (
    null
  );
};


export default withStyles(listStyles)(LinkList);

LinkList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.objectOf(PropTypes.any).isRequired,
};
