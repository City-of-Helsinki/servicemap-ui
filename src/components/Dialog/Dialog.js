import React from 'react';
import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import SMButton from '../ServiceMapButton';

const Dialog = ({
  title,
  content,
  actions,
  open,
  setOpen,
}) => {
  const intl = useIntl();

  const handleClose = () => {
    setOpen(false);
  };

  const cancelText = intl.formatMessage({ id: 'general.cancel' });

  return (
    <div>
      <MUIDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {actions}
          <SMButton onClick={handleClose} role="link">
            {cancelText}
          </SMButton>
        </DialogActions>
      </MUIDialog>
    </div>
  );
};

Dialog.propTypes = {
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  actions: PropTypes.node,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
};

Dialog.defaultProps = {
  actions: null,
  open: false,
};

export default Dialog;
