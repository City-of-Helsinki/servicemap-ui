import styled from '@emotion/styled';
import { FileCopy } from '@mui/icons-material';
import {
  ClickAwayListener,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import SMButton from '../../../components/ServiceMapButton';
import { setBboxToUrl } from '../utils/utils';

/**
 * Renders embed HTMl based on options
 */
function EmbedHTML({ createEmbedHTML, url, setBoundsRef, restrictBounds }) {
  const intl = useIntl();
  const [bbox, setBbox] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(null);

  const embedUrl = setBboxToUrl(url, restrictBounds ? bbox : null);

  const handleEventMessage = (event) => {
    // Update bbox on map move
    if (event.data.bbox) {
      setBoundsRef(event.data.bbox);
      setBbox(event.data.bbox);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setTooltipOpen(field);
      },
      () => {
        console.warn('Clipboard copy failed!');
      }
    );
  };

  const renderCopyButton = (id, title, text) => (
    <ClickAwayListener onClickAway={() => setTooltipOpen(null)}>
      <div>
        <Tooltip
          arrow
          PopperProps={{ disablePortal: true }}
          describeChild
          open={tooltipOpen === id}
          title={intl.formatMessage({ id: 'link.settings.dialog.tooltip' })}
          placement="top"
        >
          <StyledCopyButton
            icon={<StyledFileCopy />}
            color="primary"
            role="button"
            onClick={() => copyToClipboard(text, id)}
          >
            <Typography variant="button">{title}</Typography>
          </StyledCopyButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );

  useEffect(() => {
    window.addEventListener('message', handleEventMessage);
    // Run component unmount cleanup
    return () => {
      window.removeEventListener('message', handleEventMessage);
    };
  }, []);

  const htmlText = createEmbedHTML(embedUrl);

  return (
    <div>
      {/* Embed address */}
      <StyledOutlinedInput
        id="embed-address"
        inputProps={{ tabIndex: -1 }}
        value={embedUrl}
        endAdornment={
          <InputAdornment position="end">
            {renderCopyButton(
              'embedUrl',
              intl.formatMessage({ id: 'embedder.url.title' }),
              embedUrl
            )}
          </InputAdornment>
        }
      />
      {/* Embed HTML code */}
      <StyledOutlinedInputHtmlField
        id="embed-code"
        inputProps={{ tabIndex: -1 }}
        value={htmlText}
        endAdornment={
          <InputAdornment position="end">
            {renderCopyButton(
              'embedCode',
              intl.formatMessage({ id: 'embedder.code.title' }),
              htmlText
            )}
          </InputAdornment>
        }
      />
    </div>
  );
}

const StyledFileCopy = styled(FileCopy)(({ theme }) => ({
  fontSize: 16,
  paddingLeft: theme.spacing(1),
}));
const StyledCopyButton = styled(SMButton)(({ theme }) => ({
  margin: 0,
  height: 60,
  marginRight: -14,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  textTransform: 'uppercase',
  flexDirection: 'row-reverse',
  borderRadius: '8px',
}));
const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  height: 60,
  fontSize: '0.913rem',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
}));
const StyledOutlinedInputHtmlField = styled(StyledOutlinedInput)(() => ({
  backgroundColor: '#f2f2f2',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  wordWrap: 'break-word',
}));

EmbedHTML.propTypes = {
  createEmbedHTML: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  setBoundsRef: PropTypes.func.isRequired,
  restrictBounds: PropTypes.bool.isRequired,
};

export default EmbedHTML;
