import { css } from '@emotion/css';
import styled from '@emotion/styled';
import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

import useMobileStatus from '../../utils/isMobile';
import CloseButton from '../CloseButton';
import SMButton from '../ServiceMapButton';

function Dialog({
  title,
  content,
  actions = null,
  open = false,
  setOpen,
  referer = null,
  onClose = null,
}) {
  const intl = useIntl();
  const dialogRef = useRef();
  const isMobile = useMobileStatus();

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
  const muiRootClass = css({
    padding: 60,
    overflow: 'visible',
  });

  return (
    <div>
      <MUIDialog
        ref={dialogRef}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={isMobile}
        classes={!isMobile ? { root: muiRootClass } : null}
      >
        <StyledRoot>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography
            style={visuallyHidden}
            aria-hidden
            tabIndex="0"
            onFocus={focusToLastElement}
          />
          <StyledTopArea>
            <StyledCloseButtonTop autoFocus onClick={handleClose} role="link" />
            <StyledDialogTitle id="form-dialog-title" autoFocus>
              {title}
            </StyledDialogTitle>
          </StyledTopArea>
          <DialogContent className={muiRootClass}>{content}</DialogContent>
          <DialogActions>
            {actions}
            <StyledCloseButton onClick={handleClose} role="link">
              {cancelText}
            </StyledCloseButton>
          </DialogActions>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography
            style={visuallyHidden}
            aria-hidden
            tabIndex="0"
            onFocus={focusToFirstElement}
          />
        </StyledRoot>
      </MUIDialog>
    </div>
  );
}

const StyledCloseButton = styled(SMButton)(({ theme }) => ({
  ...theme.typography.body2,
  marginRight: 0,
}));

const StyledCloseButtonTop = styled(CloseButton)(() => ({
  alignSelf: 'start',
}));

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '0 1 auto',
  wordBreak: 'break-word',
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const StyledTopArea = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

Dialog.propTypes = {
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

export default Dialog;
