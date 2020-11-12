import React, { useRef } from 'react';
import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import SMButton from '../ServiceMapButton';
import CloseButton from '../CloseButton';

const Dialog = ({
  classes,
  title,
  content,
  actions,
  open,
  setOpen,
  referer,
}) => {
  const intl = useIntl();
  const dialogRef = useRef();

  const handleClose = () => {
    setOpen(false);
    if (referer?.current?.anchorEl) {
      setTimeout(() => {
        referer.current.anchorEl.focus();
      }, 1);
    }
  };

  const focusToFirstElement = () => {
    const dialog = dialogRef.current;
    const elem = dialog.querySelectorAll('button');
    elem[0].focus();
  };

  const focusToLastElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[buttons.length - 1].focus();
  };

  const cancelText = intl.formatMessage({ id: 'general.close' });

  return (
    <div>
      <MUIDialog ref={dialogRef} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {/* Empty element that makes keyboard focus loop in dialog */}
        <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={focusToLastElement} />
        <CloseButton
          autoFocus
          className={classes.closeButton}
          onClick={handleClose}
          role="link"
        />
        <DialogTitle id="form-dialog-title" autoFocus>{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {actions}
          <SMButton onClick={handleClose} role="link">
            {cancelText}
          </SMButton>
        </DialogActions>
        {/* Empty element that makes keyboard focus loop in dialog */}
        <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={focusToFirstElement} />
      </MUIDialog>
    </div>
  );
};

Dialog.propTypes = {
  classes: PropTypes.shape({
    closeButton: PropTypes.string,
  }).isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  actions: PropTypes.node,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  referer: PropTypes.shape({
    current: PropTypes.shape({
      anchorEl: PropTypes.objectOf(PropTypes.any),
    }),
  }).isRequired,
};

Dialog.defaultProps = {
  actions: null,
  open: false,
};

export default Dialog;
