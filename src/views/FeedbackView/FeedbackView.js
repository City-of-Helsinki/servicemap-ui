import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Warning } from '@material-ui/icons';
import {
  Typography, InputBase, Checkbox, FormControl, Dialog, ButtonBase,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router-dom';
import TitleBar from '../../components/TitleBar';
import SMButton from '../../components/ServiceMapButton';
import config from '../../../config';
import DesktopComponent from '../../components/DesktopComponent';

const FeedbackView = ({
  classes, navigator, intl, location, selectedUnit, getLocaleText,
}) => {
  // State
  const [email, setEmail] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [permission, setPermission] = useState(false);
  const [fbFieldVisited, setFbFieldVisited] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const feedbackMaxLength = 5000;
  const feedbackType = location.pathname.includes('unit') ? 'unit' : 'general';
  const feedbackLength = feedback ? feedback.length : 0;
  const feedbackFull = feedbackLength >= feedbackMaxLength;
  const errorMessage = fbFieldVisited && feedbackLength === 0 ? intl.formatMessage({ id: 'feedback.error.required' }) : null;

  const feedbackTitle = feedbackType === 'unit' && selectedUnit
    ? intl.formatMessage({ id: 'feedback.title.unit' }, { unit: getLocaleText(selectedUnit.name) })
    : intl.formatMessage({ id: 'feedback.title' });

  const resetForm = () => {
    setEmail(null);
    setFbFieldVisited(false);
    setFeedback(null);
    setPermission(false);
  };

  const handleChange = (type, event) => {
    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'feedback') {
      setFeedback(event.target.value);
    }
  };

  const handleSend = () => {
    setSending(true);

    let body;

    if (feedbackType === 'unit') {
      // When accessibility options are added to feedback, different service codes will be used
      const serviceCode = 1363;
      body = new URLSearchParams({
        description: feedback,
        email,
        can_be_published: permission,
        service_code: serviceCode,
        service_object_id: selectedUnit.id,
        service_object_type: 'http://www.hel.fi/servicemap/v2',
        service_request_type: 'OTHER',
      }).toString();
    } else if (feedbackType === 'general') {
      const serviceCode = 1363;
      body = new URLSearchParams({
        description: feedback,
        email,
        internal_feedback: true,
        can_be_published: permission,
        service_code: serviceCode,
        service_request_type: 'OTHER',
      }).toString();
    }

    const url = config.feedbackURL.root;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }).then((response) => {
      setSending(false);
      if (response.ok) {
        resetForm();
        setModalOpen('send');
      } else {
        setModalOpen('error');
      }
    }).catch((e) => {
      console.warn(e);
      setModalOpen('error');
      setSending(false);
    });
  };

  let feedbackPermission = null;

  // Show/Hide feedback permission checkbox dynamically
  if (config.feedbackIsPublished) {
    feedbackPermission = (
      /* Permission checkbox */
      <FormControl>
        <div className={classes.checkbox}>
          <Checkbox
            icon={<span className={classes.checkBoxIcon} />}
            size="small"
            color="primary"
            onChange={() => setPermission(!permission)}
            inputProps={{ title: intl.formatMessage({ id: 'feedback.permission' }) }}
            aria-describedby="checkboxTitle"
            classes={{ root: classes.box }}
          />
          <Typography aria-hidden><FormattedMessage id="feedback.permission" /></Typography>
        </div>
      </FormControl>
    );
  }

  return (
    <>
      {/* Exit dialog */}
      <DesktopComponent>
        <Prompt
          when={!!(!modalOpen && (email || feedback || permission))}
          message={intl.formatMessage({ id: 'feedback.modal.leave' })}
        />
      </DesktopComponent>
      {/* Confirm dialog */}
      {
        modalOpen
        && (
          <Dialog open={!!modalOpen}>
            <div className={classes.modalContainer}>
              <Typography className={classes.modalTitle}>
                <FormattedMessage id={modalOpen === 'send' ? 'feedback.modal.success' : 'feedback.modal.error'} />
              </Typography>
              <SMButton
                margin
                role="button"
                className={classes.modalButton}
                messageID="feedback.modal.confirm"
                color="primary"
                onClick={() => {
                  setModalOpen(false);
                  if (modalOpen === 'send') {
                    navigator.goBack();
                  }
                }}
              />
            </div>
          </Dialog>
        )
      }

      <form className={classes.container}>
        <TitleBar
          backButton
          title={feedbackTitle}
          titleComponent="h3"
        />
        <div className={classes.contentArea}>
          {/* Email field */}
          <FormControl>
            <Typography className={classes.title}><FormattedMessage id="feedback.email.info" /></Typography>
            <Typography id="emailTitle" className={classes.subtitle}><FormattedMessage id="feedback.email" /></Typography>
            <InputBase
              className={classes.inputField}
              aria-describedby="emailTitle"
              classes={{ input: classes.input }}
              onChange={e => handleChange('email', e)}
            />
          </FormControl>

          {/* Feedback field */}
          <FormControl>
            <Typography className={classes.title}><FormattedMessage id="feedback.feedback.info" /></Typography>
            <Typography id="feedbackTitle" className={classes.subtitle}><FormattedMessage id="feedback.feedback" /></Typography>
            <InputBase
              className={classes.inputField}
              aria-describedby={!errorMessage ? 'feedbackTitle' : 'srError'}
              multiline
              rows="5"
              classes={{ input: `${classes.input} ${errorMessage ? classes.errorField : ''}` }}
              onChange={e => handleChange('feedback', e)}
              onBlur={!fbFieldVisited ? () => setFbFieldVisited(true) : null}
              inputProps={{ maxLength: feedbackMaxLength, 'aria-invalid': !!errorMessage }}
            />
            <div className={classes.inputInfo}>
              {errorMessage && (
                <div className={classes.errorContainer}>
                  <Warning className={classes.errorIcon} />
                  &nbsp;
                  <Typography color="inherit" aria-hidden className={classes.errorText}>
                    {errorMessage}
                  </Typography>
                </div>
              )}
              {!feedbackLength && (
                <Typography id="srError" role="alert" variant="srOnly">
                  <FormattedMessage id="feedback.srError.required" />
                </Typography>
              )}
              <Typography aria-hidden className={`${classes.characterInfo} ${feedbackFull ? classes.characterInfoError : ''}`}>
                {`${feedbackLength}/${feedbackMaxLength}`}
              </Typography>
            </div>
          </FormControl>
          {feedbackPermission}
        </div>

        <div className={classes.bottomArea}>
          <Typography className={classes.infoText}><FormattedMessage id="feedback.additionalInfo" /></Typography>
          <ButtonBase
            className={classes.link}
            role="link"
            onClick={() => window.open(config.feedbackAdditionalInfoLink)}
          >
            <Typography><FormattedMessage id="feedback.additionalInfo.link" /></Typography>
          </ButtonBase>
          <SMButton
            role="button"
            disabled={!feedback || errorMessage || sending}
            aria-label={!feedback || errorMessage ? intl.formatMessage({ id: 'feedback.send.error' }) : null}
            onClick={() => handleSend()}
            messageID={sending ? 'feedback.sending' : 'feedback.send'}
            color="primary"
          />
        </div>
      </form>
    </>
  );
};

FeedbackView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedUnit: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

FeedbackView.defaultProps = {
  navigator: null,
  selectedUnit: null,
};

export default FeedbackView;
