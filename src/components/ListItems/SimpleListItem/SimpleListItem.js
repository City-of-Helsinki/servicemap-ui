import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography, Divider } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { keyboardHandler } from '../../../utils';

const SimpleListItem = (props) => {
  const {
    button,
    dark,
    text,
    classes,
    link,
    icon,
    handleItemClick,
    role,
    divider,
    selected,
    srText,
    className,
    id,
  } = props;
  const isLinkOrButton = button || link;
  return (
    <React.Fragment>
      <ListItem
        className={`${className} ${dark ? 'dark' : ''}`}
        button={!!link || button}
        role={link ? 'link' : role}
        tabIndex={isLinkOrButton ? 0 : -1}
        component="li"
        onClick={isLinkOrButton ? handleItemClick : null}
        onKeyDown={isLinkOrButton ? keyboardHandler(handleItemClick, ['enter', 'space']) : null}
        classes={{
          root: classes.listItem,
          selected: classes.itemFocus,
        }}
        selected={selected}
        id={id}
      >
        {
          icon
          && (
            <ListItemIcon aria-hidden className={`${classes.listIcon} ${link ? classes.link : ''}`}>
              {icon}
            </ListItemIcon>
          )
        }

        <ListItemText
          classes={{ root: classes.textContainer }}
        >
          <Typography
            color="inherit"
            variant="body2"
            classes={{ root: `${link ? classes.link : null} ${dark ? classes.whiteText : ''}` }}
          >
            <Typography style={visuallyHidden}>{srText}</Typography>
            {text}
          </Typography>
        </ListItemText>
      </ListItem>
      {divider && (
        <li aria-hidden>
          <Divider className={classes.divider} />
        </li>
      )}
    </React.Fragment>
  );
};

export default SimpleListItem;

SimpleListItem.propTypes = {
  button: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  dark: PropTypes.bool,
  text: PropTypes.string.isRequired,
  srText: PropTypes.string,
  link: PropTypes.bool,
  icon: PropTypes.objectOf(PropTypes.any),
  handleItemClick: PropTypes.func,
  role: PropTypes.string,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

SimpleListItem.defaultProps = {
  button: false,
  dark: false,
  srText: null,
  link: false,
  icon: null,
  handleItemClick: null,
  role: null,
  divider: false,
  selected: false,
  className: null,
  id: null,
};
