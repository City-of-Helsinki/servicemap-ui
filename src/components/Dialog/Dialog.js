import React, { useRef } from 'react';
import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
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
  onClose,
}) => {
  const intl = useIntl();
  const dialogRef = useRef();

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
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
      <MUIDialog
        ref={dialogRef}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{
          root: classes.muiRoot,
        }}
      >
        <div className={classes.root}>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={focusToLastElement} />
          <div className={classes.topArea}>
            <CloseButton
              autoFocus
              onClick={handleClose}
              role="link"
              className={classes.closeButtonTop}
            />
            <DialogTitle className={classes.title} id="form-dialog-title" autoFocus>{title}</DialogTitle>
          </div>
          <DialogContent className={classes.muiRoot}>
            {content}
          </DialogContent>
          <DialogActions>
            {actions}
            <SMButton className={classes.closeButton} onClick={handleClose} role="link">
              {cancelText}
            </SMButton>
          </DialogActions>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={focusToFirstElement} />
        </div>
      </MUIDialog>
    </div>
  );
};

Dialog.propTypes = {
  classes: PropTypes.shape({
    closeButton: PropTypes.string,
    closeButtonTop: PropTypes.string,
    muiRoot: PropTypes.string,
    root: PropTypes.string,
    title: PropTypes.string,
    topArea: PropTypes.string,
  }).isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  actions: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  referer: PropTypes.shape({
    current: PropTypes.shape({
      anchorEl: PropTypes.objectOf(PropTypes.any),
    }),
  }),
};

Dialog.defaultProps = {
  actions: null,
  onClose: null,
  open: false,
  referer: null,
};

export default Dialog;
