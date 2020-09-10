import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ClickAwayListener,
  Typography,
  ButtonBase,
} from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { keyboardHandler } from '../../utils';

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
                key={v.key}
                className={classes.menuItem}
                role="link"
                onClick={v.onClick}
                onKeyPress={keyboardHandler(v.onClick, ['space', 'enter'])}
                component="span"
                tabIndex="0"
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
      buttonIcon, buttonText, classes, panelID,
    } = this.props;
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
          aria-controls={open ? panelID : undefined}
          aria-haspopup="true"
          aria-expanded={open}
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
  }).isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
  menuAriaLabel: PropTypes.string.isRequired,
  panelID: PropTypes.string.isRequired,
};

DropDownMenuButton.defaultProps = {
  buttonIcon: null,
};

export default DropDownMenuButton;
