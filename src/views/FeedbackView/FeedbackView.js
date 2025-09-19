import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Warning } from '@mui/icons-material';
import {
  ButtonBase,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputBase,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import config from '../../../config';
import { DesktopComponent, SMButton, TitleBar } from '../../components';
import ClientOnlyRouterPrompt from '../../components/RouterPrompt/ClientOnlyRouterPrompt';
import { validateEmail } from '../../utils';
import { focusToViewTitle } from '../../utils/accessibility';
import useMobileStatus from '../../utils/isMobile';
import useLocaleText from '../../utils/useLocaleText';

const formFieldInitialState = {
  email: {
    value: '',
    error: false,
    errorMessageId: null,
  },
  feedback: {
    value: null,
    error: false,
    errorMessageId: null,
  },
};

function FeedbackView({ navigator = null, intl, selectedUnit = null }) {
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const isMobile = useMobileStatus();
  const theme = useTheme();
  // State
  const [permission, setPermission] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [formFields, setFormFields] = useState(formFieldInitialState);

  const feedbackMaxLength = 5000;
  const feedbackType = location.pathname.includes('unit') ? 'unit' : 'general';
  const feedbackLength = formFields?.feedback?.value
    ? formFields.feedback.value.length
    : 0;
  const feedbackFull = feedbackLength >= feedbackMaxLength;
  const email = formFields.email.value;
  const feedback = formFields.feedback.value;

  const isUnitFeedback = feedbackType === 'unit';

  const feedbackTitle =
    isUnitFeedback && selectedUnit
      ? intl.formatMessage(
          { id: 'feedback.title.unit' },
          { unit: getLocaleText(selectedUnit.name) }
        )
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

  const backButtonCallback = React.useCallback(() => {
    if (isUnitFeedback && navigator && selectedUnit) {
      navigator.closeFeedback(selectedUnit.id);
    }
  }, [navigator, selectedUnit, isUnitFeedback]);

  const backButtonSrText = isUnitFeedback
    ? intl.formatMessage({ id: 'general.back.unit' })
    : null;
  const handleSend = () => {
    if (!validateForm()) {
      setTimeout(() => {
        // Take focus back to first invalid form element
        const focusTarget = document.querySelectorAll(
          'form [aria-invalid="true"]'
        );
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
      body = new URLSearchParams({
        description: formFields.feedback.value,
        email: formFields.email.value,
        can_be_published: permission,
        service_object_id: selectedUnit.id,
        service_object_type: 'https://www.hel.fi/servicemap/v2',
        service_request_type: 'OTHER',
      }).toString();
    } else if (feedbackType === 'general') {
      body = new URLSearchParams({
        description: formFields.feedback.value,
        email: formFields.email.value,
        internal_feedback: true,
        can_be_published: permission,
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
    })
      .then((response) => {
        setSending(false);
        if (response.ok) {
          resetForm();
          setModalOpen('send');
        } else {
          setModalOpen('error');
        }
      })
      .catch((e) => {
        console.warn(e);
        setModalOpen('error');
        setSending(false);
      });
  };

  let feedbackPermission = null;
  const boxClass = css({
    marginLeft: -8,
    padding: 8,
    marginRight: 8,
  });
  // Show/Hide feedback permission checkbox dynamically
  if (config.feedbackIsPublished) {
    feedbackPermission = (
      /* Permission checkbox */
      <FormControl>
        <StyledCheckboxContainer>
          <Checkbox
            icon={<StyledCheckboxIcon />}
            size="small"
            color="primary"
            onChange={() => setPermission(!permission)}
            inputProps={{
              title: intl.formatMessage({ id: 'feedback.permission' }),
              'aria-labelledby': 'checkboxTitle',
            }}
            aria-labelledby="checkboxTitle"
            classes={{ root: boxClass }}
          />
          <Typography aria-hidden>
            <FormattedMessage id="feedback.permission" />
          </Typography>
        </StyledCheckboxContainer>
      </FormControl>
    );
  }
  const errorClass = css({
    border: `1px solid ${theme.palette.warning.main}`,
    boxShadow: `0 0 0 1px ${theme.palette.warning.main}`,
  });
  const inputClass = css({
    fontSize: '0.75rem',
    lineHeight: '20px',
    padding: 10,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    borderRadius: 2,
    border: '1px solid #000',
    '&:focus': {
      outline: '2px solid transparent',
      boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
    },
  });
  return (
    <>
      {/* Exit dialog */}
      <DesktopComponent>
        <ClientOnlyRouterPrompt
          when={!!(!modalOpen && (email || feedback || permission))}
          onOK={() => {
            return true;
          }}
          onCancel={() => {
            return false;
          }}
          title={intl.formatMessage({ id: 'feedback.modal.leave' })}
          content={intl.formatMessage({ id: 'feedback.modal.leave' })}
        />
      </DesktopComponent>
      {/* Confirm dialog */}
      {modalOpen && (
        <Dialog
          open={!!modalOpen}
          onEntered={() => document.getElementById('dialog-title').focus()}
        >
          <StyledModalContainer>
            <DialogTitle tabIndex={-1} id="dialog-title">
              <StyledModalTitle aria-live="polite">
                <FormattedMessage
                  id={
                    modalOpen === 'send'
                      ? 'feedback.modal.success'
                      : 'feedback.modal.error'
                  }
                />
              </StyledModalTitle>
            </DialogTitle>
            <DialogContent>
              <StyledModalButton
                margin
                role="button"
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
          </StyledModalContainer>
        </Dialog>
      )}

      <StyledFormContainer>
        <TitleBar
          backButton={!isMobile}
          backButtonOnClick={backButtonCallback}
          backButtonSrText={backButtonSrText}
          title={feedbackTitle}
          titleComponent="h3"
          data-sm="FeedbackTitle"
        />
        <StyledContentArea>
          {/* Email field */}
          <FormControl>
            <StyledTitle id="emailTitle">
              <span style={visuallyHidden}>
                <FormattedMessage id="feedback.email" />
              </span>
              <FormattedMessage id="feedback.email.info" />
            </StyledTitle>
            <StyledSubtitle aria-hidden>
              <FormattedMessage id="feedback.email" />
            </StyledSubtitle>
            <StyledInput
              autoComplete="email"
              type="email"
              classes={{
                input: `${inputClass} ${formFields.email.error ? errorClass : ''}`,
              }}
              onChange={(e) => handleChange('email', e)}
              onBlur={() => validateEmailField()}
              inputProps={{
                maxLength: feedbackMaxLength,
                'aria-invalid': !!formFields.email.error,
                'aria-labelledby': !formFields.email.error
                  ? 'emailTitle'
                  : 'srErrorEmail',
              }}
            />
          </FormControl>
          <StyledInputInfoContainer>
            {formFields.email.error && (
              <>
                <StyledErrorContainer aria-hidden>
                  <StyledWarning />
                  &nbsp;
                  <StyledErrorText color="inherit" aria-hidden>
                    {intl.formatMessage({
                      id: formFields.email.errorMessageId,
                    })}
                  </StyledErrorText>
                </StyledErrorContainer>
                <Typography
                  id="srErrorEmail"
                  role="alert"
                  style={visuallyHidden}
                >
                  <FormattedMessage id="feedback.srError.email.invalid" />
                </Typography>
              </>
            )}
          </StyledInputInfoContainer>

          {/* Feedback field */}
          <FormControl>
            <StyledTitle id="feedbackTitle">
              <span style={visuallyHidden}>
                <FormattedMessage id="feedback.feedback" />
              </span>
              <FormattedMessage id="feedback.feedback.info" />
            </StyledTitle>
            <StyledSubtitle aria-hidden>
              <FormattedMessage id="feedback.feedback" />
            </StyledSubtitle>
            <StyledInput
              multiline
              rows="5"
              classes={{
                input: `${inputClass} ${formFields.feedback.error ? errorClass : ''}`,
              }}
              onChange={(e) => handleChange('feedback', e)}
              onBlur={() => validateFeedbackField()}
              inputProps={{
                maxLength: feedbackMaxLength,
                'aria-invalid': !!formFields.feedback.error,
                'aria-labelledby': !formFields.feedback.error
                  ? 'feedbackTitle'
                  : 'srErrorFeedback',
              }}
            />
          </FormControl>
          <StyledInputInfoContainer>
            {formFields.feedback.error && (
              <>
                <StyledErrorContainer aria-hidden>
                  <StyledWarning />
                  &nbsp;
                  <StyledErrorText color="inherit" aria-hidden>
                    {intl.formatMessage({
                      id: formFields.feedback.errorMessageId,
                    })}
                  </StyledErrorText>
                </StyledErrorContainer>
                <Typography
                  id="srErrorFeedback"
                  role="alert"
                  style={visuallyHidden}
                >
                  <FormattedMessage id="feedback.srError.feedback.required" />
                </Typography>
              </>
            )}
            <StyledCharacterInfo aria-hidden feedback={+feedbackFull}>
              {`${feedbackLength}/${feedbackMaxLength}`}
            </StyledCharacterInfo>
          </StyledInputInfoContainer>
          {feedbackPermission}
        </StyledContentArea>

        <StyledBottomArea>
          <StyledInfoText>
            <FormattedMessage id="feedback.additionalInfo" />
          </StyledInfoText>
          <StyledLink
            id="FeedbackInfoLink"
            role="link"
            onClick={() =>
              window.open(getLocaleText(config.feedbackAdditionalInfoLink))
            }
          >
            <Typography>
              <FormattedMessage id="feedback.additionalInfo.link" />
            </Typography>
          </StyledLink>
          <SMButton
            role="button"
            onClick={() => handleSend()}
            messageID={sending ? 'feedback.sending' : 'feedback.send'}
            color="primary"
          />
        </StyledBottomArea>
      </StyledFormContainer>
    </>
  );
}
const StyledCharacterInfo = styled(Typography)(({ theme, feedback }) => {
  const styles = {
    color: '#000',
    margin: 0,
    marginLeft: 'auto',
  };
  if (feedback) {
    Object.assign(styles, {
      color: `${theme.palette.warning.main}`,
    });
  }
  return styles;
});
const StyledErrorText = styled(Typography)(() => ({
  fontSize: '0.75rem',
  margin: 0,
}));
const StyledWarning = styled(Warning)(() => ({
  fontSize: '1rem',
}));
const StyledErrorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: `${theme.palette.warning.main}`,
}));
const StyledInputInfoContainer = styled('div')(() => ({
  display: 'flex',
}));
const StyledFormContainer = styled('form')(({ theme }) => ({
  height: '100%',
  paddingBottom: theme.spacing(3),
  backgroundColor: '#EEEEEE',
}));
const StyledContentArea = styled('div')(() => ({
  paddingLeft: 28,
  paddingRight: 28,
  textAlign: 'left',
}));
const StyledTitle = styled(Typography)(() => ({
  paddingTop: 16,
  paddingBottom: 14,
  paddingRight: 16,
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));
const StyledSubtitle = styled(Typography)(() => ({
  paddingLeft: 8,
  fontSize: '0.75rem',
}));
const StyledInput = styled(InputBase)(() => ({
  backgroundColor: '#fff',
  marginTop: 4,
  marginBottom: 4,
  padding: 0,
}));
const StyledModalContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 24,
}));
const StyledModalTitle = styled(Typography)(() => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  textAlign: 'center',
}));
const StyledModalButton = styled(SMButton)(() => ({
  width: 135,
  color: '#fff',
}));
const StyledLink = styled(ButtonBase)(({ theme }) => ({
  color: theme.palette.link.main,
  marginTop: 14,
  marginBottom: 26,
  textAlign: 'left',
  textDecoration: 'underline',
}));
const StyledBottomArea = styled('div')(() => ({
  paddingTop: 8,
  textAlign: 'left',
  borderTop: '1px solid rgba(0,0,0,0.2)',
  paddingLeft: 28,
  paddingRight: 28,
}));
const StyledInfoText = styled(Typography)(() => ({
  marginTop: 14,
}));
const StyledCheckboxContainer = styled('div')(() => ({
  display: 'flex',
  paddingTop: 16,
  paddingBottom: 32,
  alignItems: 'center',
  '&:focus': {
    border: '1px solid #1964E6',
  },
}));
const StyledCheckboxIcon = styled('span')(({ theme }) => ({
  width: 15,
  height: 15,
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.primary.main};`,
  borderRadius: 1,
}));
FeedbackView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedUnit: PropTypes.objectOf(PropTypes.any),
};

export default FeedbackView;
