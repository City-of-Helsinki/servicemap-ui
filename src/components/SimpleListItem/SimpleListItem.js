import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core';
// import listStyles from '../../views/UnitView/styles/listStyles';

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
        classes={{
          root: classes.textContainer,
          primary: `${classes.listLinkText} ${link ? classes.link : null}`,
        }}
        primary={text}
      />
    </ListItem>
  );
};

const listItemStyles = {
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
    fontWeight: 400,
    fontSize: '0.911em',
  },
  link: {
    color: '#0000EE',
  },
  listIcon: {
    width: '24px',
    height: '24px',
    margin: '16px',
  },
};

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
