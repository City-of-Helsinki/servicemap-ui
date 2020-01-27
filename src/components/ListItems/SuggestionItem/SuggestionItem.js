import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Typography, Divider, Button,
} from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { intlShape } from 'react-intl';
import config from '../../../../config';
import BoldedText from '../../../utils/BoldedText';
import { keyboardHandler } from '../../../utils';

const SuggestionItem = (props) => {
  const {
    button,
    classes,
    divider,
    text,
    handleItemClick,
    handleArrowClick,
    icon,
    intl,
    link,
    selected,
    srText,
    subtitle,
    query,
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const isMobile = useMediaQuery(`(max-width:${config.mobileUiBreakpoint}px)`);
  const onClick = (button || link) && handleItemClick
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
        button={!!link || button}
        component="li"
        classes={{
          root: classes.listItem,
        }}
        selected={selected}
        className="suggestion"
        onClick={onClick}
        onMouseDown={onClick}
        onMouseUp={() => setMouseDown(false)}
        onKeyDown={() => {
          keyboardHandler(onClick, ['space', 'enter']);
        }}
        onKeyUp={() => setMouseDown(false)}
      >
        <span
          className={classes.container}
          type="submit"
          role="link"
          tabIndex="-1"
        >
          <ListItemIcon aria-hidden className={`${classes.listIcon} ${link ? classes.link : null}`}>
            {icon}
          </ListItemIcon>

          <ListItemText
            className={classes.text}
            classes={{ root: classes.textContainer }}
          >
            <Typography variant="srOnly">
              {`${srText || ''} ${text} ${subtitle || ''}`}
            </Typography>

            <Typography
              aria-hidden
              variant="body2"
              classes={{ root: link ? classes.link : null }}
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
              className={`${classes.suggestIcon} ${link ? classes.link : null}`}
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
        <li>
          <Divider aria-hidden className={classes.divider} />
        </li>
      ) : null}
    </React.Fragment>
  );
};

export default SuggestionItem;

SuggestionItem.propTypes = {
  button: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  srText: PropTypes.string,
  intl: intlShape.isRequired,
  link: PropTypes.bool,
  icon: PropTypes.objectOf(PropTypes.any),
  handleArrowClick: PropTypes.func,
  handleItemClick: PropTypes.func,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  query: PropTypes.string,
};

SuggestionItem.defaultProps = {
  button: false,
  srText: null,
  link: false,
  icon: null,
  handleArrowClick: null,
  handleItemClick: null,
  divider: false,
  selected: false,
  subtitle: null,
  query: null,
};
