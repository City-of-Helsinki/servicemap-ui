import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Typography, Divider, Button,
} from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import BoldedText from '../../BoldedText';
import { keyboardHandler } from '../../../utils';
import useMobileStatus from '../../../utils/isMobile';

const SuggestionItem = (props) => {
  const {
    classes,
    divider,
    text,
    handleItemClick,
    handleArrowClick,
    icon,
    intl,
    selected,
    subtitle,
    query,
    role,
    id,
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const isMobile = useMobileStatus();
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
        className="suggestion"
        onClick={onClick}
        onMouseDown={onClick}
        onMouseUp={() => setMouseDown(false)}
        onKeyDown={keyboardHandler(onClick, ['space', 'enter'])}
        onKeyUp={() => setMouseDown(false)}
        role={role || 'link'}
        tabIndex="0"
        id={id}
      >
        <span
          className={classes.container}
          type="submit"
          role="link"
          tabIndex="-1"
        >
          <ListItemIcon aria-hidden className={`${classes.listIcon}`}>
            {icon}
          </ListItemIcon>

          <ListItemText
            className={classes.text}
            classes={{ root: classes.textContainer }}
          >
            <Typography variant="srOnly">
              {`${text} ${subtitle || ''}`}
            </Typography>

            <Typography
              aria-hidden
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
        {
          isMobile
          && handleArrowClick
          && (
            <Button
              aria-label={intl.formatMessage({ id: 'search.arrowLabel' })}
              className={`${classes.suggestIcon}`}
              classes={{
                label: classes.suggestIconLabel,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = text.props ? text.props.text : text;
                handleArrowClick(value);
                return false;
              }}
            >
              <ArrowUpward style={{ transform: 'rotate(-48deg)' }} />
            </Button>
          )
        }
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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  handleArrowClick: PropTypes.func,
  handleItemClick: PropTypes.func,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  query: PropTypes.string,
  role: PropTypes.string,
  id: PropTypes.string,
};

SuggestionItem.defaultProps = {
  icon: null,
  handleArrowClick: null,
  handleItemClick: null,
  divider: false,
  selected: false,
  subtitle: null,
  query: null,
  role: null,
  id: null,
};
