import React from 'react';
import PropTypes from 'prop-types';
import { Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { useTheme } from '@mui/styles';
import { keyboardHandler } from '../../../utils';

const SimpleListItem = (props) => {
  const {
    button = false,
    dark = false,
    text,
    link = false,
    icon = null,
    handleItemClick = null,
    role = null,
    divider = false,
    selected = false,
    srText = null,
    className = null,
    id = null,
  } = props;
  const isLinkOrButton = button || link;
  const theme = useTheme();

  const listItemRootClass = css({
    minHeight: '3.5rem',
    padding: theme.spacing(1),
    color: '#000',
    '&.dark': {
      paddingLeft: 26,
      color: '#fff',
    },
  });

  const listItemSelectedClass = css({
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  });

  const listItemTextClass = css({
    padding: theme.spacing(1, 0),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    whiteSpace: 'pre-line',
    userSelect: 'text',
    cursor: 'default',
  });

  const linkClass = css({
    color: theme.palette.link.main,
    cursor: 'pointer',
    textDecoration: 'underline',
  });

  const whiteTextClass = css({
    color: '#fff',
  });

  return (
    <>
      <ListItemButton
        className={`${className} ${dark ? 'dark' : ''}`}
        role={link ? 'link' : role}
        tabIndex={isLinkOrButton ? 0 : -1}
        component="li"
        onClick={isLinkOrButton ? handleItemClick : null}
        onKeyDown={isLinkOrButton ? keyboardHandler(handleItemClick, ['enter', 'space']) : null}
        classes={{
          root: listItemRootClass,
          selected: listItemSelectedClass,
        }}
        selected={selected}
        id={id}
      >
        {
          icon
          && (
            <StyledListItemIcon aria-hidden link={+(!!link)}>
              {icon}
            </StyledListItemIcon>
          )
        }

        <ListItemText
          classes={{ root: listItemTextClass }}
        >
          <Typography
            color="inherit"
            variant="body2"
            classes={{ root: `${link ? linkClass : null} ${dark ? whiteTextClass : ''}` }}
          >
            {text}
          </Typography>
          <Typography style={visuallyHidden}>{srText}</Typography>
        </ListItemText>
      </ListItemButton>
      {divider && (
        <li aria-hidden>
          <StyledDivider />
        </li>
      )}
    </>
  );
};

const StyledListItemIcon = styled(ListItemIcon)(({ theme, link }) => {
  const styles = {
    width: '1.5rem',
    height: '1.5rem',
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: 0,
    color: 'inherit',
  };
  if (link) {
    Object.assign(styles, {
      color: theme.palette.link.main,
      textDecoration: 'underline',
    });
  }
  return styles;
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(9),
  marginRight: theme.spacing(-2),
}));

export default SimpleListItem;

SimpleListItem.propTypes = {
  button: PropTypes.bool,
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
