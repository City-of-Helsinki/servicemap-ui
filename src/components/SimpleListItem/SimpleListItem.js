import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, Typography } from '@material-ui/core';

const SimpleListItem = (props) => {
  const {
    text, classes, link, icon, handleItemClick,
  } = props;
  return (
    <ListItem
      button={!!link}
      role={link ? 'link' : null}
      component={link ? 'a' : null}
      onClick={link ? () => {
        handleItemClick();
      } : null}
      classes={{
        root: classes.listItem,
      }}
    >
      <ListItemIcon className={`${classes.listIcon} ${link ? classes.link : null}`}>
        {icon}
      </ListItemIcon>

      <ListItemText
        classes={{ root: classes.textContainer }}
      >
        <Typography
          variant="body2"
          classes={{ root: link ? classes.link : null }}
        >
          {text}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

const listItemStyles = theme => ({
  listItem: {
    height: '3.5rem',
    padding: 0,
  },
  textContainer: {
    padding: 0,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 5.25,
  },
  link: {
    color: '#0000EE',
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: '1rem',
  },
});

export default withStyles(listItemStyles)(SimpleListItem);

SimpleListItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.bool,
  icon: PropTypes.objectOf(PropTypes.any),
  handleItemClick: PropTypes.func,
};

SimpleListItem.defaultProps = {
  link: false,
  icon: null,
  handleItemClick: null,
};
