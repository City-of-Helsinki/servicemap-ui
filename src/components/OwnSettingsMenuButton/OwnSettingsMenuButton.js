import React from 'react';
import PropTypes from 'prop-types';
import { Button, ClickAwayListener, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { keyboardHandler } from '../../utils';
import SettingsDropdowns from '../SettingsDropdowns';

class OwnSettingsMenuButton extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (event, refocus = false) => {
    this.setState({ open: false });
    // If refocus set to true focus back to OwnSettingsMenuButton
    if (refocus && this.anchorEl) {
      this.anchorEl.focus();
    }
  };

  renderMenu = () => {
    const {
      classes, menuAriaLabel, panelID,
    } = this.props;
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <div
          id={panelID}
          aria-label={menuAriaLabel}
          className={classes.menuPanel}
          role="region"
        >
          <Typography sx={{
            textAlign: 'left', fontWeight: 700, fontSize: '1.03rem', pb: 1,
          }}
          >
            <FormattedMessage id="general.ownSettings" />
          </Typography>
          <SettingsDropdowns variant="ownSettings" />
          <div aria-hidden role="button" tabIndex="0" onFocus={() => this.handleClose()} />
        </div>
      </ClickAwayListener>
    );
  };

  render() {
    const {
      buttonIcon, buttonText, classes, id, panelID,
    } = this.props;
    const { open } = this.state;

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
        </Button>
        {
          open && this.renderMenu()
        }
      </div>
    );
  }
}

OwnSettingsMenuButton.propTypes = {
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
  menuAriaLabel: PropTypes.string.isRequired,
  panelID: PropTypes.string.isRequired,
};

OwnSettingsMenuButton.defaultProps = {
  buttonIcon: null,
  id: null,
};

export default OwnSettingsMenuButton;
