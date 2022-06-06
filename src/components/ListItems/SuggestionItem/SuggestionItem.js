import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Typography, Divider, Button,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import BoldedText from '../../BoldedText';
import { keyboardHandler } from '../../../utils';

const SuggestionItem = (props) => {
  const {
    classes,
    className,
    divider,
    text,
    handleItemClick,
    handleRemoveClick,
    icon,
    selected,
    subtitle,
    query,
    role,
    id,
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const onClick = handleItemClick
    ? (e) => {
      e.preventDefault();
      if (!mouseDown) {
        handleItemClick();
        setMouseDown(true);
      }
    } : null;

  return (
    <React.Fragment>
      <ListItem
        button
        component="li"
        classes={{
          root: classes.listItem,
          selected: classes.itemFocus,
        }}
        selected={selected}
        className={`suggestion ${className || ''}`}
        onMouseDown={onClick}
        onMouseUp={() => setMouseDown(false)}
        onKeyDown={keyboardHandler(onClick, ['space', 'enter'])}
        onKeyUp={() => setMouseDown(false)}
        onClick={() => handleItemClick()}
        role={role || 'link'}
        aria-label={`${text} ${subtitle || ''}`}
        id={id}
      >
        <span
          className={classes.container}
        >
          <ListItemIcon aria-hidden className={`${classes.listIcon}`}>
            {icon}
          </ListItemIcon>

          <ListItemText
            className={classes.text}
            classes={{ root: classes.textContainer }}
          >

            <Typography
              aria-hidden
              className={handleRemoveClick ? classes.historyText : ''}
              variant="body2"
            >
              {
                query
                  ? (
                    <BoldedText
                      text={text}
                      shouldBeBold={query}
                    />
                  ) : text
              }
            </Typography>
            {
            subtitle
            && (
              <Typography
                aria-hidden
                variant="body2"
                className={classes.subtitle}
              >
                {subtitle}
              </Typography>

            )
          }
          </ListItemText>
        </span>
        {handleRemoveClick && (
          <Button
            aria-hidden
            className={`${classes.suggestIcon}`}
            classes={{
              label: classes.suggestIconLabel,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const value = text.props ? text.props.text : text;
              handleRemoveClick(value);
              return false;
            }}
          >
            <Typography variant="caption" className={classes.removeText}>
              <FormattedMessage id="search.removeSuggestion" />
            </Typography>
          </Button>
        )}
      </ListItem>
      {divider ? (
        <li aria-hidden>
          <Divider aria-hidden className={classes.divider} />
        </li>
      ) : null}
    </React.Fragment>
  );
};

export default SuggestionItem;

SuggestionItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  handleRemoveClick: PropTypes.func,
  handleItemClick: PropTypes.func,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  query: PropTypes.string,
  role: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

SuggestionItem.defaultProps = {
  icon: null,
  handleItemClick: null,
  handleRemoveClick: null,
  divider: false,
  selected: false,
  subtitle: null,
  query: null,
  role: null,
  id: null,
  className: null,
};
