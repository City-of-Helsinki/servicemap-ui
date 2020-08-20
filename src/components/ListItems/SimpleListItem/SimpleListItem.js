import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography, Divider } from '@material-ui/core';
import { keyboardHandler } from '../../../utils';

const SimpleListItem = (props) => {
  const {
    button, text, classes, link, icon, handleItemClick, role, divider, selected, srText, className,
  } = props;
  const isLinkOrButton = button || link;
  return (
    <React.Fragment>
      <ListItem
        aria-label={`${srText || ''} ${text}`}
        className={className}
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
      >
        {
          icon
          && (
            <ListItemIcon aria-hidden className={`${classes.listIcon} ${link ? classes.link : null}`}>
              {icon}
            </ListItemIcon>
          )
        }

        <ListItemText
          classes={{ root: classes.textContainer }}
        >
          {/* ReadSpeaker text - hidden form view and screen readers */}
          <Typography aria-hidden variant="srOnly">
            {`${srText || ''}`}
          </Typography>

          <Typography
            aria-hidden
            variant="body2"
            classes={{ root: link ? classes.link : null }}
          >
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
  text: PropTypes.string.isRequired,
  srText: PropTypes.string,
  link: PropTypes.bool,
  icon: PropTypes.objectOf(PropTypes.any),
  handleItemClick: PropTypes.func,
  role: PropTypes.string,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  className: PropTypes.string,
};

SimpleListItem.defaultProps = {
  button: false,
  srText: null,
  link: false,
  icon: null,
  handleItemClick: null,
  role: null,
  divider: false,
  selected: false,
  className: null,
};
