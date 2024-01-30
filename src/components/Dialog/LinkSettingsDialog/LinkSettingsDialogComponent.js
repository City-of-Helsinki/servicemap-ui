import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { FileCopy, Share } from '@mui/icons-material';
import {
  ButtonBase,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import { selectSelectedAccessibilitySettings } from '../../../redux/selectors/settings';
import isClient from '../../../utils';
import SettingsUtility from '../../../utils/settings';
import useLocaleText from '../../../utils/useLocaleText';
import Dialog from '../index';

const CopyTooltip = ({
  children,
  ...rest
}) => (
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

CopyTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

const LinkSettingsDialogComponent = ({
  activateSetting,
  resetAccessibilitySettings,
  setOpen,
  ...rest
}) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const unit = useSelector(getSelectedUnit);
  const a11ySettings = useSelector(selectSelectedAccessibilitySettings)
    .map(setting => {
      const impairmentKey = SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(setting);
      return impairmentKey || setting;
    });
  const [selected, setSelected] = useState('none');
  const [copyTooltipOpen1, setCopyTooltipOpen1] = useState(false);
  const [copyTooltipOpen2, setCopyTooltipOpen2] = useState(false);
  const [showAriaAlert, setShowAriaAlert] = useState(false);
  const theme = useTheme();
  let timeout = null;
  let timeoutAriaAlert = null;


  useEffect(() => () => {
    clearTimeout(timeout);
    clearTimeout(timeoutAriaAlert);
  }, []);

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

  const actionButtonText = intl.formatMessage({ id: 'link.settings.dialog.buttons.action' });
  const title = intl.formatMessage({ id: 'link.settings.dialog.title' });
  const unitName = (unit && unit.name) ? getLocaleText(unit.name) : '';
  const tooltip = intl.formatMessage({ id: 'link.settings.dialog.tooltip' });
  const tooltipAria = intl.formatMessage({ id: `link.settings.dialog.tooltip.aria${(selected !== 'none' && '.a11y') || ''}` });
  const radioAria = intl.formatMessage({ id: 'link.settings.dialog.radio.label' });

  const getLinkUrl = () => {
    const url = new URL(window.location.href);
    if (a11ySettings.length && selected !== 'none') {
      const mobility = a11ySettings.find(v => SettingsUtility.isValidMobilitySetting(v));
      const senses = a11ySettings
        .filter(v => SettingsUtility.isValidAccessibilitySenseImpairment(v));

      if (mobility) {
        url.searchParams.append('mobility', mobility);
      }

      if (senses.length) {
        url.searchParams.append('senses', senses.join(','));
      }
    }
    return url.toString();
  };
  const url = getLinkUrl();

  const getSettingsLabel = () => {
    let text = '';

    try {
      a11ySettings.forEach((v, i) => {
        if (SettingsUtility.isValidMobilitySetting(v)) {
          text += `${intl.formatMessage({ id: `settings.mobility.${v}` })}`;
        } else if (SettingsUtility.isValidAccessibilitySenseImpairment(v)) {
          text += `${intl.formatMessage({ id: `settings.sense.${v}` })}`;
        }
        text += (i + 1) < a11ySettings.length ? ', ' : '';
      });
    } catch (e) {
      console.warn(`Unable to get settings label: ${e.message}`);
    }

    return text;
  };

  const items = [
    {
      value: 'use',
      checked: false,
      label: getSettingsLabel(),
    },
    {
      value: 'none',
      checked: false,
      label: intl.formatMessage({ id: 'accept.settings.dialog.none' }),
    },
  ];

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
      },
    );
  };

  const toggleAriaLive = () => {
    setShowAriaAlert(true);
    timeoutAriaAlert = setTimeout(() => {
      setShowAriaAlert(false);
    }, 2000);
  };

  const radioGroupItemClass = css({
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(1)} 0`,
    },
  });

  return (
    <Dialog
      open
      setOpen={setOpen}
      {...rest}
      title={title}
      content={(
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
          <Typography variant="subtitle1"><FormattedMessage id="link.settings.dialog.subtitle" /></Typography>
          <Typography variant="body2"><FormattedMessage id="link.settings.dialog.description" /></Typography>
          <div>
            <StyledRadioGroup
              aria-label={radioAria}
              name="setting"
              value={selected}
              onChange={(event, value) => {
                setSelected(value);
              }}
            >
              {
                items.map(item => item.label !== '' && (
                  <FormControlLabel
                    key={item.label}
                    control={(
                      <Radio
                        color="primary"
                      />
                      )}
                    label={item.label}
                    value={item.value}
                    classes={{
                      root: radioGroupItemClass,
                    }}
                  />
                ))
              }
            </StyledRadioGroup>
          </div>
          {
            showAriaAlert
            && (
              <Typography aria-live="polite" id="copy_link_aria_live" style={visuallyHidden}><FormattedMessage id="link.settings.dialog.tooltip" /></Typography>
            )
          }
        </StyledContainer>
      )}
      actions={(
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
      )}
    />
  );
};

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

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  flexWrap: 'nowrap',
  flexDirection: 'row',
  margin: `${theme.spacing(2)} 0`,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
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
