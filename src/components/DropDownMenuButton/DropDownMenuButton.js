import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ClickAwayListener,
  Typography,
  ButtonBase,
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { keyboardHandler } from '../../utils';

class DropDownMenuButton extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (event, refocus = false) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
    // If refocus set to true focus back to DropDownMenuButton
    if (refocus && this.anchorEl) {
      this.anchorEl.focus();
    }
  };

  handleItemClick = (event, item) => {
    this.handleClose(event);
    item.onClick();
  }

  // Menu should close if user leaves the selection area
  closeMenuOnFocusExit = (event) => {
    const { menuItems } = this.props;
    const menuItemIds = menuItems.map(v => v.id);

    if (!menuItemIds.includes(event?.relatedTarget.id)) {
      this.handleClose(event);
    }
  }

  renderMenu = () => {
    const {
      classes, menuItems, menuAriaLabel, panelID,
    } = this.props;
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <div
          id={panelID}
          aria-label={menuAriaLabel}
          className={classes.menuPanel}
          role="region"
        >
          {
            menuItems.map(v => (
              <ButtonBase
                id={v.id}
                key={v.key}
                className={classes.menuItem}
                role="link"
                onClick={e => this.handleItemClick(e, v)}
                onKeyDown={keyboardHandler(e => this.handleClose(e, true), ['esc'])}
                onKeyPress={keyboardHandler(this.handleItemClick, ['space', 'enter'])}
                onBlur={this.closeMenuOnFocusExit}
                component="span"
                tabIndex="0"
                aria-hidden={v.ariaHidden}
              >
                <span>{v.icon}</span>
                <Typography component="p" variant="body2">{v.text}</Typography>
              </ButtonBase>
            ))
          }
        </div>
      </ClickAwayListener>
    );
  }

  render() {
    const {
      buttonIcon, buttonText, classes, id, panelID,
    } = this.props;
    const { open } = this.state;
    const arrowIcon = open
      ? <ArrowDropUp className={classes.iconRight} />
      : <ArrowDropDown className={classes.iconRight} />;

    return (
      <div className={classes.root}>
        <Button
          id={id}
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
          className={classes.button}
        >
          {
            buttonIcon && (
              <span className={classes.icon}>{buttonIcon}</span>
            )
          }
          <Typography component="p" variant="subtitle1">{buttonText}</Typography>
          {arrowIcon}
        </Button>
        {
          open && this.renderMenu()
        }
      </div>
    );
  }
}

DropDownMenuButton.propTypes = {
  buttonIcon: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string,
    button: PropTypes.string,
    menuItem: PropTypes.string,
    menuPanel: PropTypes.string,
    icon: PropTypes.string,
    iconRight: PropTypes.string,
  }).isRequired,
  id: PropTypes.string,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
  menuAriaLabel: PropTypes.string.isRequired,
  panelID: PropTypes.string.isRequired,
};

DropDownMenuButton.defaultProps = {
  buttonIcon: null,
  id: null,
};

export default DropDownMenuButton;
