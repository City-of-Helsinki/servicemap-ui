/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import LinkListItem from './LinkListItem';
import listStyles from '../listStyles';

class LinkList extends React.Component {
  handleClick = () => {
    console.log('clicked');
  }

  render() {
    const { classes, data, title } = this.props;
    if (data.length > 0) {
      return (
        <div>
          <Typography className={classes.title} variant="h3">{title}</Typography>
          <List>
            {data.map(data => (
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
  }
}


export default withStyles(listStyles)(LinkList);

LinkList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.objectOf(PropTypes.any).isRequired,
};
