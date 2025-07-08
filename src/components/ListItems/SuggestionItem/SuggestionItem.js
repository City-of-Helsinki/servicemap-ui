import { css } from '@emotion/css';
import styled from '@emotion/styled';
import {
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { keyboardHandler } from '../../../utils';
import BoldedText from '../../BoldedText';

function SuggestionItem(props) {
  const {
    className = null,
    divider = false,
    text,
    handleItemClick = null,
    handleRemoveClick = null,
    icon = null,
    selected = false,
    subtitle = null,
    query = null,
    role = null,
    id = null,
  } = props;
  const theme = useTheme();

  const [mouseDown, setMouseDown] = useState(false);
  const onClick = handleItemClick
    ? (e) => {
        e.preventDefault();
        if (!mouseDown) {
          handleItemClick();
          setMouseDown(true);
        }
      }
    : null;
  const textContainer = css({
    display: 'flex',
    padding: theme.spacing(1, 0),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    whiteSpace: 'pre-line',
    '& p': {
      lineHeight: '1.125rem',
    },
  });

  const listItem = css({
    padding: theme.spacing(0, 1),
  });

  const itemFocus = css({
    outline: '80px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  });

  const suggestIconLabel = css({
    padding: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.87)',
    textTransform: 'none',
    '&:hover': {
      color: '#2242C7',
      textDecorationLine: 'underline',
    },
  });

  return (
    <>
      <ListItemButton
        component="li"
        classes={{
          root: listItem,
          selected: itemFocus,
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
        <StyledContainer>
          <StyledListItemIcon aria-hidden>{icon}</StyledListItemIcon>

          <StyledListItemText classes={{ root: textContainer }}>
            <StyledHistoryText
              aria-hidden
              handleremoveclick={handleRemoveClick ? 'true' : undefined}
              variant="body2"
            >
              {query ? <BoldedText text={text} shouldBeBold={query} /> : text}
            </StyledHistoryText>
            {subtitle && (
              <StyledSubtitle aria-hidden variant="body2">
                {subtitle}
              </StyledSubtitle>
            )}
          </StyledListItemText>
        </StyledContainer>
        {handleRemoveClick && (
          <StyledSuggestIcon
            aria-hidden
            classes={{
              label: suggestIconLabel,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const value = text.props ? text.props.text : text;
              handleRemoveClick(value);
              return false;
            }}
          >
            <StyledRemoveText variant="caption">
              <FormattedMessage id="search.removeSuggestion" />
            </StyledRemoveText>
          </StyledSuggestIcon>
        )}
      </ListItemButton>
      {divider ? (
        <li aria-hidden>
          <StyledDivider aria-hidden />
        </li>
      ) : null}
    </>
  );
}

const StyledContainer = styled('span')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  padding: theme.spacing(0.5, 0),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: theme.spacing(0.5, 1),
  marginRight: 0,
  alignSelf: 'center',
  padding: theme.spacing(0.5),
  minWidth: 0,
}));

const StyledListItemText = styled(ListItemText)(() => ({
  alignSelf: 'center',
}));

const StyledHistoryText = styled(Typography)(({ handleremoveclick }) => {
  const styles = {};
  if (handleremoveclick) {
    Object.assign(styles, {
      color: '#660DD7',
    });
  }
  return styles;
});

const StyledSubtitle = styled(Typography)(() => ({
  fontSize: '0.625rem',
  fontWeight: 'none',
  lineHeight: '1.125rem',
}));

const StyledRemoveText = styled(Typography)(() => ({
  color: 'inherit',
}));

const StyledSuggestIcon = styled(Button)(({ theme }) => ({
  color: '#757575',
  height: 'auto',
  margin: 0,
  padding: theme.spacing(2),
  marginRight: theme.spacing(-1),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(8),
  marginRight: theme.spacing(-2),
}));

export default SuggestionItem;

SuggestionItem.propTypes = {
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
