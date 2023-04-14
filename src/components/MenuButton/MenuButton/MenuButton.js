import React from 'react';
import PropTypes from 'prop-types';
import { Button, ClickAwayListener, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { keyboardHandler } from '../../../utils';

class MenuButton extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (event, refocus = false) => {
    this.setState({ open: false });
    // If refocus set to true focus back to MenuButton
    if (refocus && this.anchorEl) {
      this.anchorEl.focus();
    }
  };

  renderMenu = () => {
    const {
      intl, classes, menuAriaLabel, panelID, children, menuHeader,
    } = this.props;
    const menuAriaLabelTranslated = intl.formatMessage({ id: menuAriaLabel });
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <div
          id={panelID}
          aria-label={menuAriaLabelTranslated}
          className={classes.menuPanel}
          role="region"
        >
          <Typography sx={{
            textAlign: 'left', fontWeight: 700, fontSize: '1.03rem', pb: 1,
          }}
          >
            <FormattedMessage id={menuHeader} />
          </Typography>
          {children}
          <div aria-hidden role="button" tabIndex="0" onFocus={() => this.handleClose()} />
        </div>
      </ClickAwayListener>
    );
  };

  render() {
    const {
      intl, buttonIcon, buttonText, classes, id, panelID,
    } = this.props;
    const { open } = this.state;
    const buttonTextTranslated = intl.formatMessage({ id: buttonText });


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
          <Typography component="p" variant="subtitle1">{buttonTextTranslated}</Typography>
        </Button>
        {
          open && this.renderMenu()
        }
      </div>
    );
  }
}

MenuButton.propTypes = {
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
  children: PropTypes.node.isRequired,
  menuHeader: PropTypes.string.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

MenuButton.defaultProps = {
  buttonIcon: null,
  id: null,
};

export default MenuButton;
