import { Button, Dialog } from 'hds-react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useBlocker } from 'react-router';

const RouterPrompt = ({ when, onOK, onCancel, title, content }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const blockerRef = useRef(null);
  const intl = useIntl();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (when && currentLocation.pathname !== nextLocation.pathname) {
      blockerRef.current = { currentLocation, nextLocation };

      setShowPrompt(true);
      return true;
    }

    return false;
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (when) {
        event.preventDefault();
        event.returnValue = content;
        return event.returnValue;
      }
      return undefined;
    };

    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, when]);

  const handleOK = useCallback(async () => {
    setShowPrompt(false);
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute && blocker.state === 'blocked') {
        blocker.proceed();
      }
    } else if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [onOK, blocker]);

  const handleCancel = useCallback(async () => {
    setShowPrompt(false);
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute && blocker.state === 'blocked') {
        blocker.proceed();
      } else if (blocker.state === 'blocked') {
        blocker.reset();
      }
    } else if (blocker.state === 'blocked') {
      blocker.reset();
    }
  }, [onCancel, blocker]);

  const handleDialogClose = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  if (!showPrompt) {
    return null;
  }

  const titleId = 'navigation-prompt-title';
  const descriptionId = 'navigation-prompt-description';

  return (
    <Dialog
      close={handleDialogClose}
      isOpen={showPrompt}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'general.close' })}
    >
      <Dialog.Header id={titleId} title={title} />
      <Dialog.Content>{content}</Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={handleOK}>
          {intl.formatMessage({ id: 'general.yes' })}
        </Button>
        <Button onClick={handleCancel} variant="secondary">
          {intl.formatMessage({ id: 'general.cancel' })}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

RouterPrompt.propTypes = {
  when: PropTypes.bool.isRequired,
  onOK: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default RouterPrompt;
