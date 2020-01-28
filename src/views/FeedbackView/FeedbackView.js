import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Warning } from '@material-ui/icons';
import {
  Typography, InputBase, Checkbox, FormControl, Link, Dialog,
} from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router-dom';
import TitleBar from '../../components/TitleBar';
import SMButton from '../../components/ServiceMapButton';
import config from '../../../config';

const FeedbackView = ({
  classes, navigator, intl, location, selectedUnit, getLocaleText,
}) => {
  // State
  const [email, setEmail] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [permission, setPermission] = useState(false);
  const [fbFieldVisited, setFbFieldVisited] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
      if (response.ok) {
        resetForm();
        setModalOpen('send');
      } else {
        setModalOpen('error');
      }
    }).catch((e) => {
      console.warn(e);
      setModalOpen('error');
    });
  };

  return (
    <>
      {/* Exit dialog */}
      <Prompt
        when={!!(!modalOpen && (email || feedback || permission))}
        message={intl.formatMessage({ id: 'feedback.modal.leave' })}
      />
      {/* Confirm dialog */}
      <Dialog open={!!modalOpen}>
        <div className={classes.modalContainer}>
          <Typography className={classes.modalTitle}>
            <FormattedMessage id={modalOpen === 'send' ? 'feedback.modal.success' : 'feedback.modal.error'} />
          </Typography>
          <SMButton
            className={classes.modalButton}
            messageID="feedback.modal.confirm"
            onClick={() => {
              setModalOpen(false);
              if (modalOpen === 'send') {
                navigator.goBack();
              }
            }}
          />
        </div>
      </Dialog>

      <form>
        <TitleBar backButton backButtonOnClick={() => navigator.goBack()} title={feedbackTitle} />
        <div className={classes.contentArea}>
          {/* Email field */}
          <FormControl>
            <Typography className={classes.title}><FormattedMessage id="feedback.email.info" /></Typography>
            <Typography id="emailTitle" className={classes.subtitle}><FormattedMessage id="feedback.email" /></Typography>
            <InputBase
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
              aria-describedby="feedbackTitle"
              multiline
              rows="5"
              classes={{ input: `${classes.input} ${errorMessage ? classes.errorField : ''}` }}
              onChange={e => handleChange('feedback', e)}
              onBlur={!fbFieldVisited ? () => setFbFieldVisited(true) : null}
              inputProps={{ maxLength: feedbackMaxLength }}
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
              <Typography aria-hidden className={`${classes.characterInfo} ${feedbackFull ? classes.characterInfoError : ''}`}>
                {`${feedbackLength}/${feedbackMaxLength}`}
              </Typography>
            </div>
          </FormControl>

          {/* Permission checkbox */}
          <FormControl>
            <div className={classes.checkbox}>
              <Checkbox
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
        </div>

        <div className={classes.bottomArea}>
          <Typography className={classes.infoText}><FormattedMessage id="feedback.additionalInfo" /></Typography>
          <Typography className={classes.infoText}>
            <Link
              href="https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/osallistu-ja-vaikuta/palaute/ohjeita-palautteesta"
              target="_blank"
            >
              <FormattedMessage id="feedback.additionalInfo.link" />
            </Link>
          </Typography>
          <SMButton
            disabled={!feedback || errorMessage}
            onClick={() => handleSend()}
            messageID="feedback.send"
            margin
          />
        </div>
      </form>
    </>
  );
};

FeedbackView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedUnit: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

FeedbackView.defaultProps = {
  navigator: null,
  selectedUnit: null,
};

export default FeedbackView;
