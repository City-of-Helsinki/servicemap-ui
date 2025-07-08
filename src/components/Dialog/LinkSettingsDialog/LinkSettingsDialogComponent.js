import styled from '@emotion/styled';
import { FileCopy, Share } from '@mui/icons-material';
import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import {
  selectMapType,
  selectSelectedAccessibilitySettings,
} from '../../../redux/selectors/settings';
import isClient from '../../../utils';
import SettingsUtility from '../../../utils/settings';
import useLocaleText from '../../../utils/useLocaleText';
import Dialog from '../index';

function CopyTooltip({ children, ...rest }) {
  return (
    <Tooltip
      arrow
      PopperProps={{
        disablePortal: true,
      }}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement="top"
      {...rest}
    >
      {children}
    </Tooltip>
  );
}

CopyTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

function LinkSettingsDialogComponent({
  activateSetting,
  resetAccessibilitySettings,
  setOpen,
  ...rest
}) {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const unit = useSelector(getSelectedUnit);
  const mapType = useSelector(selectMapType);
  const a11ySettings = useSelector(selectSelectedAccessibilitySettings).map(
    (setting) => {
      const impairmentKey =
        SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(setting);
      return impairmentKey || setting;
    }
  );
  const [copyTooltipOpen1, setCopyTooltipOpen1] = useState(false);
  const [copyTooltipOpen2, setCopyTooltipOpen2] = useState(false);
  const [showAriaAlert, setShowAriaAlert] = useState(false);
  let timeout = null;
  let timeoutAriaAlert = null;

  useEffect(
    () => () => {
      clearTimeout(timeout);
      clearTimeout(timeoutAriaAlert);
    },
    []
  );

  if (!isClient()) {
    return null;
  }

  const tooltipFadeTime = 2000;

  const delayedTooltipClose = (stateSetter) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      stateSetter(false);
    }, tooltipFadeTime);
  };

  const actionButtonText = intl.formatMessage({
    id: 'link.settings.dialog.buttons.action',
  });
  const title = intl.formatMessage({ id: 'link.settings.dialog.title' });
  const unitName = unit && unit.name ? getLocaleText(unit.name) : '';
  const tooltip = intl.formatMessage({ id: 'link.settings.dialog.tooltip' });
  const tooltipAria = intl.formatMessage({
    id: 'link.settings.dialog.tooltip.aria.a11y',
  });

  const getLinkUrl = () => {
    const url = new URL(window.location.href);
    if (a11ySettings.length) {
      const mobility = a11ySettings.find((v) =>
        SettingsUtility.isValidMobilitySetting(v)
      );
      const senses = a11ySettings.filter((v) =>
        SettingsUtility.isValidAccessibilitySenseImpairment(v)
      );

      if (mobility) {
        url.searchParams.set('mobility', mobility);
      }

      if (senses.length) {
        url.searchParams.set('senses', senses.join(','));
      }
    }
    url.searchParams.set('map', mapType);
    return url.toString();
  };
  const url = getLinkUrl();

  const copyToClipboard = (stateSetter) => {
    if (!stateSetter) {
      throw new Error('Invalid parameter stateSetter given to copyToClipboard');
    }
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(url).then(
      () => {
        stateSetter(true);
        delayedTooltipClose(stateSetter);
      },
      (e) => {
        console.warn(`Error while copying to clipboard: ${e.message}`);
      }
    );
  };

  const toggleAriaLive = () => {
    setShowAriaAlert(true);
    timeoutAriaAlert = setTimeout(() => {
      setShowAriaAlert(false);
    }, 2000);
  };

  return (
    <Dialog
      open
      setOpen={setOpen}
      {...rest}
      title={title}
      content={
        <StyledContainer data-sm="DialogContainer">
          <CopyTooltip
            open={copyTooltipOpen1}
            title={tooltip}
            aria-label={tooltipAria}
          >
            <StyledUrlContainer
              onClick={() => {
                toggleAriaLive();
                copyToClipboard(setCopyTooltipOpen1);
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div>
                <Typography variant="subtitle1">{unitName}</Typography>
                <StyledLinkText>{url}</StyledLinkText>
              </div>
              <StyledFileCopy />
            </StyledUrlContainer>
          </CopyTooltip>
          {showAriaAlert && (
            <Typography
              aria-live="polite"
              id="copy_link_aria_live"
              style={visuallyHidden}
            >
              <FormattedMessage id="link.settings.dialog.tooltip" />
            </Typography>
          )}
        </StyledContainer>
      }
      actions={
        <CopyTooltip
          open={copyTooltipOpen2}
          title={tooltip}
          aria-label={tooltipAria}
        >
          <StyledShareButton
            onClick={() => {
              toggleAriaLive();
              copyToClipboard(setCopyTooltipOpen2);
            }}
          >
            {actionButtonText}
            <StyledShare />
          </StyledShareButton>
        </CopyTooltip>
      }
    />
  );
}

const StyledContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledUrlContainer = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(222, 223, 225, 0.25)',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  margin: `0 0 ${theme.spacing(3)} 0`,
  border: '1px solid #DEDFE1',
  width: '100%',
  textAlign: 'left',
  '&:hover': {
    backgroundColor: 'rgba(222, 223, 225, 0.50)',
  },
}));

const StyledLinkText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  wordBreak: 'break-word',
}));

const StyledFileCopy = styled(FileCopy)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(1),
}));

const StyledShare = styled(Share)(({ theme }) => ({
  fontSize: '1rem',
  marginLeft: theme.spacing(1),
}));

const StyledShareButton = styled(ButtonBase)(({ theme }) => ({
  ...theme.typography.body2,
  boxSizing: 'border-box',
  borderRadius: 2,
  color: theme.palette.primary.highContrast,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '&:disabled': {
    backgroundColor: theme.palette.disabled.strong,
  },
  minHeight: 38,
  padding: '0 11px',
}));

LinkSettingsDialogComponent.propTypes = {
  activateSetting: PropTypes.func.isRequired,
  resetAccessibilitySettings: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default LinkSettingsDialogComponent;
