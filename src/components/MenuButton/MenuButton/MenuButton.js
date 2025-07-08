import styled from '@emotion/styled';
import {
  Button,
  ButtonBase,
  ClickAwayListener,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import config from '../../../../config';
import { keyboardHandler } from '../../../utils';

class MenuButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  handleClose = (event, refocus = false) => {
    this.setState({ open: false });
    // If refocus set to true focus back to MenuButton
    if (refocus && this.anchorEl) {
      this.anchorEl.focus();
    }
  };

  handleItemClick = (event, item) => {
    this.handleClose(event);
    item.onClick();
  };

  // Menu should close if user leaves the selection area
  closeMenuOnFocusExit = (event) => {
    const { menuItems } = this.props;
    const menuItemIds = menuItems.map((v) => v.id);

    const relatedTargetId = event?.relatedTarget.id || '';
    // TODO not good to have "-map-type-radio" here
    if (
      !menuItemIds.includes(relatedTargetId) &&
      !relatedTargetId.includes('-map-type-radio')
    ) {
      this.handleClose(event);
    }
  };

  renderMenu = () => {
    const { panelID, children, menuHeader, menuItems, menuAriaLabel } =
      this.props;
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <StyledMenuPanel
          id={panelID}
          aria-label={menuAriaLabel}
          role="region"
          disableGutters
          sx={{
            overflowY: panelID === 'SettingsMenuPanel' ? 'visible' : 'auto',
          }}
        >
          <Typography
            component="h2"
            sx={{
              textAlign: 'left',
              fontWeight: 700,
              fontSize: '1.03rem',
              pb: 1,
            }}
          >
            <FormattedMessage id={menuHeader} />
          </Typography>
          {menuItems.map((v, i) => (
            <React.Fragment key={v.key}>
              <StyledMenuItemButton
                id={v.id}
                key={v.key}
                role="link"
                onClick={(e) => this.handleItemClick(e, v)}
                onKeyDown={keyboardHandler(
                  (e) => this.handleClose(e, true),
                  ['esc']
                )}
                onKeyPress={keyboardHandler(this.handleItemClick, [
                  'space',
                  'enter',
                ])}
                onBlur={this.closeMenuOnFocusExit}
                component="span"
                tabIndex={0}
                aria-hidden={v.ariaHidden}
              >
                <span>{v.icon}</span>
                <Typography
                  component="h3"
                  sx={{ pl: 3, fontWeight: 700 }}
                  variant="subtitle1"
                >
                  {v.text}
                </Typography>
              </StyledMenuItemButton>
              {i !== menuItems.length - 1 ? <Divider aria-hidden /> : null}
            </React.Fragment>
          ))}
          {children}
          <div
            aria-hidden
            role="button"
            tabIndex="0"
            onFocus={() => this.handleClose()}
          />
        </StyledMenuPanel>
      </ClickAwayListener>
    );
  };

  render() {
    const {
      buttonIcon = null,
      buttonText,
      id = null,
      panelID,
      dataSm,
    } = this.props;
    const { open } = this.state;

    return (
      <StyledContainer>
        <StyledButton
          id={id}
          data-sm={dataSm}
          ref={(node) => {
            this.anchorEl = node;
          }}
          aria-controls={open ? panelID : undefined}
          aria-haspopup="true"
          aria-expanded={open}
          onClick={this.handleToggle}
          onKeyDown={(e) => {
            if (open) {
              keyboardHandler(this.handleClose, ['esc'])(e);
            }
          }}
        >
          {buttonIcon && <StyledIcon>{buttonIcon}</StyledIcon>}
          <Typography component="p" variant="subtitle1">
            {buttonText}
          </Typography>
        </StyledButton>
        {open && this.renderMenu()}
      </StyledContainer>
    );
  }
}

const StyledMenuPanel = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  maxHeight: `calc(100vh - ${config.topBarHeight}px)`,
  width: 450,
  padding: theme.spacing(2),
  paddingTop: theme.spacing(3),
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: 'black',
  zIndex: 2,
  border: `${theme.palette.detail.alpha} solid 0.5px`,
  borderRadius: 4,
  right: 0,
}));

const StyledMenuItemButton = styled(ButtonBase)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  justifyContent: 'start',
  alignItems: 'center',
  cursor: 'pointer',
  ...theme.typography.body2,
  // Text element
  '& p': {
    textAlign: 'left',
    textTransform: 'none',
    fontWeight: 'normal',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
}));

const StyledContainer = styled('div')(() => ({
  alignItems: 'center',
  display: 'block',
  height: '100%',
  width: 180,
  flex: '0 1 auto',
}));

const StyledButton = styled(Button)(() => ({
  height: '100%',
  width: '100%',
  '& p': {
    textTransform: 'none',
  },
  color: 'black',
  justifyContent: 'flex-start',
}));

const StyledIcon = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingRight: theme.spacing(1),
}));

MenuButton.propTypes = {
  buttonIcon: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  id: PropTypes.string,
  menuAriaLabel: PropTypes.string.isRequired,
  panelID: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  menuHeader: PropTypes.string.isRequired,
  dataSm: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      id: PropTypes.string,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default MenuButton;
