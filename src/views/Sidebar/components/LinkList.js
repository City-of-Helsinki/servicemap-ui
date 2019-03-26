/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OpenLinkIcon from '@material-ui/icons/OpenInNew';

class LinkList extends React.Component {
  handleClick = () => {
    console.log('clicked');
  }

  render() {
    const { classes } = this.props;
    const list = [0, 1, 2, 3];
    return (
      <div>
        <Typography className={classes.title} variant="h3">Sähköiset palvelut</Typography>
        <List>
          {list.map(number => (
            <div key={number}>
              <ListItem
                button
                // role="link"
                component="a"
                onClick={() => {
                  this.handleClick();
                }}
                classes={{
                  root: classes.listItem,
                }}
              >
                <ListItemIcon className={classes.icon}>
                  <OpenLinkIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    root: classes.textContainer,
                    primary: classes.listLinkText,
                  }}
                  primary="Hakemus varhaiskasvatukseen tai esiopetukseen (uusi välilehti)"
                />
              </ListItem>
              <Divider className={classes.divider} />
            </div>
          ))}
        </List>
      </div>
    );
  }
}

const styles = () => ({
  title: {
    float: 'left',
    marginLeft: '15px',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.5,
  },
  listItem: {
    height: '56px',
    padding: 0,
    paddingTop: '7px',
    paddingBottom: '9px',
  },
  textContainer: {
    padding: 0,
    marginLeft: '16px',
    marginRight: '42px',
  },
  listLinkText: {
    color: '#0000EE',
    fontWeight: 400,
    fontSize: '0.911em',
  },
  divider: {
    marginLeft: '72px',
  },
  icon: {
    color: '#0000EE',
    width: '24px',
    height: '24px',
    margin: '16px',
  },
});

export default withStyles(styles)(LinkList);

LinkList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
