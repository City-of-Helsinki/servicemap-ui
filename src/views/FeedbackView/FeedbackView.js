import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Warning } from '@mui/icons-material';
import {
  Typography, InputBase, Checkbox, FormControl, Dialog, ButtonBase, DialogTitle, DialogContent,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router-dom';
import config from '../../../config';
import { focusToViewTitle } from '../../utils/accessibility';
import useLocaleText from '../../utils/useLocaleText';
import {
  DesktopComponent,
  SMButton,
  TitleBar,
} from '../../components';
import { validateEmail } from '../../utils';

const formFieldInitialState = {
  email: {
    value: null,
    error: false,
    errorMessageId: null,
  },
  feedback: {
    value: null,
    error: false,
    errorMessageId: null,
  },
};

const FeedbackView = ({
  classes, navigator, intl, location, selectedUnit,
}) => {
  const getLocaleText = useLocaleText();
  // State
  const [permission, setPermission] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [formFields, setFormFields] = useState(formFieldInitialState);

  const feedbackMaxLength = 5000;
  const feedbackType = location.pathname.includes('unit') ? 'unit' : 'general';
  const feedbackLength = formFields?.feedback?.value ? formFields.feedback.value.length : 0;
  const feedbackFull = feedbackLength >= feedbackMaxLength;
  const email = formFields.email.value;
  const feedback = formFields.feedback.value;

  const isUnitFeedback = feedbackType === 'unit';

  const feedbackTitle = isUnitFeedback && selectedUnit
    ? intl.formatMessage({ id: 'feedback.title.unit' }, { unit: getLocaleText(selectedUnit.name) })
    : intl.formatMessage({ id: 'feedback.title' });

  useEffect(() => {
    focusToViewTitle();
  }, []);

  const resetForm = () => {
    setFormFields(formFieldInitialState);
    setPermission(false);
  };

  const validateEmailField = () => {
    let valid = true;
    const newFormFields = {
      ...formFields,
    };

    if (!newFormFields?.email?.value) {
      newFormFields.email.error = false;
      newFormFields.email.errorMessageId = null;
    } else if (!validateEmail(newFormFields.email.value)) {
      valid = false;
      newFormFields.email.error = true;
      newFormFields.email.errorMessageId = 'feedback.error.email.invalid';
    }

    setFormFields(newFormFields);
    return valid;
  };

  const validateFeedbackField = () => {
    let valid = true;
    const newFormFields = {
      ...formFields,
    };

    // Check that string is not empty or only whitespaces
    if (newFormFields.feedback?.value?.replace(/\s/g, '').length > 0) {
      newFormFields.feedback.error = false;
      newFormFields.feedback.errorMessageId = null;
    } else {
      valid = false;
      newFormFields.feedback.error = true;
      newFormFields.feedback.errorMessageId = 'feedback.error.required';
    }

    setFormFields(newFormFields);
    return valid;
  };

  const validateForm = () => {
    let valid = true;

    if (!validateEmailField()) {
      valid = false;
    }

    if (!validateFeedbackField()) {
      valid = false;
    }

    return valid;
  };

  const handleChange = (type, event) => {
    if (Object.prototype.hasOwnProperty.call(formFields, type)) {
      const newFormFields = {
        ...formFields,
      };
      newFormFields[type] = {
        value: event.target.value,
        error: false,
        errorMessageId: null,
      };
      setFormFields(newFormFields);
    }
  };

  const backButtonCallback = isUnitFeedback
    ? React.useCallback(() => {
      navigator.closeFeedback(selectedUnit.id);
    }, [navigator, feedbackType])
    : null;
  const backButtonSrText = backButtonCallback ? intl.formatMessage({ id: 'general.back.unit' }) : null;
  const handleSend = () => {
    if (!validateForm()) {
      setTimeout(() => {
        // Take focus back to first invalid form element
        const focusTarget = document.querySelectorAll('form [aria-invalid="true"]');
        if (focusTarget?.length > 0) {
          focusTarget[0].focus();
        }
      }, 150);
      return;
    }
    setSending(true);

    let body;

    if (feedbackType === 'unit') {
      // When accessibility options are added to feedback, different service codes will be used
      const serviceCode = 1363;
      body = new URLSearchParams({
        description: formFields.feedback.value,
        email: formFields.email.value,
        can_be_published: permission,
        service_code: serviceCode,
        service_object_id: selectedUnit.id,
        service_object_type: 'https://www.hel.fi/servicemap/v2',
        service_request_type: 'OTHER',
      }).toString();
    } else if (feedbackType === 'general') {
      const serviceCode = 1363;
      body = new URLSearchParams({
        description: formFields.feedback.value,
        email: formFields.email.value,
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
            inputProps={{
              title: intl.formatMessage({ id: 'feedback.permission' }),
              'aria-labelledby': 'checkboxTitle',
            }}
            aria-labelledby="checkboxTitle"
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
          <Dialog open={!!modalOpen} onEntered={() => document.getElementById('dialog-title').focus()}>
            <div className={classes.modalContainer}>
              <DialogTitle tabIndex={-1} id="dialog-title">
                <Typography aria-live="polite" className={classes.modalTitle}>
                  <FormattedMessage id={modalOpen === 'send' ? 'feedback.modal.success' : 'feedback.modal.error'} />
                </Typography>
              </DialogTitle>
              <DialogContent>
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
              </DialogContent>
            </div>
          </Dialog>
        )
      }

      <form className={classes.container}>
        <TitleBar
          backButton
          backButtonOnClick={backButtonCallback}
          backButtonSrText={backButtonSrText}
          title={feedbackTitle}
          titleComponent="h3"
        />
        <div className={classes.contentArea}>
          {/* Email field */}
          <FormControl>
            <Typography id="emailTitle" className={classes.title}>
              <span style={visuallyHidden}><FormattedMessage id="feedback.email" /></span>
              <FormattedMessage id="feedback.email.info" />
            </Typography>
            <Typography aria-hidden className={classes.subtitle}><FormattedMessage id="feedback.email" /></Typography>
            <InputBase
              autoComplete="email"
              type="email"
              className={classes.inputField}
              classes={{ input: `${classes.input} ${formFields.email.error ? classes.errorField : ''}` }}
              onChange={e => handleChange('email', e)}
              onBlur={() => validateEmailField()}
              inputProps={{
                maxLength: feedbackMaxLength,
                'aria-invalid': !!formFields.email.error,
                'aria-labelledby': !formFields.email.error ? 'emailTitle' : 'srErrorEmail',
              }}
            />
          </FormControl>
          <div className={classes.inputInfo}>
            {formFields.email.error && (
              <>
                <div aria-hidden className={classes.errorContainer}>
                  <Warning className={classes.errorIcon} />
                  &nbsp;
                  <Typography color="inherit" aria-hidden className={classes.errorText}>
                    {intl.formatMessage({ id: formFields.email.errorMessageId })}
                  </Typography>
                </div>
                <Typography id="srErrorEmail" role="alert" style={visuallyHidden}>
                  <FormattedMessage id="feedback.srError.email.invalid" />
                </Typography>
              </>
            )}
          </div>

          {/* Feedback field */}
          <FormControl>
            <Typography id="feedbackTitle" className={classes.title}>
              <span style={visuallyHidden}><FormattedMessage id="feedback.feedback" /></span>
              <FormattedMessage id="feedback.feedback.info" />
            </Typography>
            <Typography aria-hidden className={classes.subtitle}><FormattedMessage id="feedback.feedback" /></Typography>
            <InputBase
              className={classes.inputField}
              multiline
              rows="5"
              classes={{ input: `${classes.input} ${formFields.feedback.error ? classes.errorField : ''}` }}
              onChange={e => handleChange('feedback', e)}
              onBlur={() => validateFeedbackField()}
              inputProps={{
                maxLength: feedbackMaxLength,
                'aria-invalid': !!formFields.feedback.error,
                'aria-labelledby': !formFields.feedback.error ? 'feedbackTitle' : 'srErrorFeedback',
              }}
            />
          </FormControl>
          <div className={classes.inputInfo}>
            {formFields.feedback.error && (
              <>
                <div aria-hidden className={classes.errorContainer}>
                  <Warning className={classes.errorIcon} />
                  &nbsp;
                  <Typography color="inherit" aria-hidden className={classes.errorText}>
                    {intl.formatMessage({ id: formFields.feedback.errorMessageId })}
                  </Typography>
                </div>
                <Typography id="srErrorFeedback" role="alert" style={visuallyHidden}>
                  <FormattedMessage id="feedback.srError.feedback.required" />
                </Typography>
              </>
            )}
            <Typography aria-hidden className={`${classes.characterInfo} ${feedbackFull ? classes.characterInfoError : ''}`}>
              {`${feedbackLength}/${feedbackMaxLength}`}
            </Typography>
          </div>
          {feedbackPermission}
        </div>

        <div className={classes.bottomArea}>
          <Typography className={classes.infoText}><FormattedMessage id="feedback.additionalInfo" /></Typography>
          <ButtonBase
            id="FeedbackInfoLink"
            className={classes.link}
            role="link"
            onClick={() => window.open(config.feedbackAdditionalInfoLink)}
          >
            <Typography><FormattedMessage id="feedback.additionalInfo.link" /></Typography>
          </ButtonBase>
          <SMButton
            role="button"
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
};

FeedbackView.defaultProps = {
  navigator: null,
  selectedUnit: null,
};

export default FeedbackView;
