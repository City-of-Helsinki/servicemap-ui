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
    const { classes, links, title } = this.props;
    if (links.length > 0) {
      return (
        <div>
          <Typography className={classes.title} variant="h3">{title}</Typography>
          <List>
            {links.map(link => (
              <div key={null}>
                <ListItem
                  button
                  component="a"
                  onClick={() => {
                    this.handleClick();
                  }}
                  classes={{
                    root: classes.listItem,
                  }}
                >
                  {/* placeholder icon */}
                  <ListItemIcon className={classes.linkIcon}>
                    <OpenLinkIcon />
                  </ListItemIcon>

                  <ListItemText
                    classes={{
                      root: classes.textContainer,
                      primary: classes.listLinkText,
                    }}
                    primary={`${link.name.fi} (uusi välilehti)`}
                  />
                </ListItem>
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

const listStyles = () => ({
  title: {
    float: 'left',
    marginLeft: '15px',
    marginTop: '12px',
    marginBottom: '12px',
    fontWeight: 700,
    fontSize: '16.48px',
    lineHeight: 1.5,
  },
  listItem: {
    height: '56px',
    paddingLeft: 0,
    paddingRight: 0,
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
  linkIcon: {
    color: '#0000EE',
    width: '24px',
    height: '24px',
    margin: '16px',
  },
});

export default withStyles(listStyles)(LinkList);

LinkList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};
