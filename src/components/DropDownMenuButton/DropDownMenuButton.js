import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Grow,
  Typography,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

class DropDownMenuButton extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  renderMenu = () => {
    const { classes, menuItems } = this.props;

    return (
      <MenuList>
        {
          menuItems.map(v => (
            <MenuItem key={v.key} onClick={v.onClick} className={classes.menuItem}>
              <span>{v.icon}</span>
              <Typography component="p" variant="body2">{v.text}</Typography>
            </MenuItem>
          ))
        }
      </MenuList>
    );
  }

  render() {
    const { buttonIcon, buttonText, classes } = this.props;
    const { open } = this.state;
    const arrowIcon = open
      ? <ArrowDropUp className={classes.iconRight} />
      : <ArrowDropDown className={classes.iconRight} />;

    return (
      <div className={classes.root}>
        <Button
          buttonRef={(node) => {
            this.anchorEl = node;
          }}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          aria-pressed={open}
          onClick={this.handleToggle}
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
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  {
                    this.renderMenu()
                  }
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
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
  }).isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

DropDownMenuButton.defaultProps = {
  buttonIcon: null,
};

export default DropDownMenuButton;
