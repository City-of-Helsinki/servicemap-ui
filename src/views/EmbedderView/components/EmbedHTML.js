import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ClickAwayListener, InputAdornment, OutlinedInput, Tooltip, Typography,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import { FileCopy } from '@material-ui/icons';
import { getEmbedURL } from '../utils/utils';
import SMButton from '../../../components/ServiceMapButton';


/**
   * Renders embed HTMl based on options
*/
const EmbedHTML = ({
  classes, createEmbedHTML, url, setBoundsRef, restrictBounds,
}) => {
  const intl = useIntl();
  const [bbox, setBbox] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(null);

  const embedUrl = getEmbedURL(url, { bbox: restrictBounds ? bbox : null });

  const handleEventMessage = (event) => {
    // Update bbox on map move
    if (event.data.bbox) {
      setBoundsRef(event.data.bbox);
      setBbox(event.data.bbox);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setTooltipOpen(field);
    }, () => {
      console.warn('Clipboard copy failed!');
    });
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
          <SMButton
            icon={<FileCopy className={classes.copyIcon} />}
            className={classes.copyButton}
            color="primary"
            role="button"
            onClick={() => copyToClipboard(text, id)}
          >
            <Typography variant="button">{title}</Typography>
          </SMButton>
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
  const textFieldClass = `${classes.textField} ${classes.marginBottom}`;

  return (
    <div>
      {/* Embed address */}
      <OutlinedInput
        id="embed-address"
        inputProps={{ tabIndex: -1 }}
        className={textFieldClass}
        value={embedUrl}
        endAdornment={(
          <InputAdornment position="end">
            {renderCopyButton(
              'embedUrl',
              intl.formatMessage({ id: 'embedder.url.title' }),
              embedUrl,
            )}
          </InputAdornment>
        )}
      />
      {/* Embed HTML code */}
      <OutlinedInput
        id="embed-code"
        inputProps={{ tabIndex: -1 }}
        className={`${textFieldClass} ${classes.htmlField}`}
        value={htmlText}
        endAdornment={(
          <InputAdornment position="end">
            {renderCopyButton(
              'embedCode',
              intl.formatMessage({ id: 'embedder.code.title' }),
              htmlText,
            )}
          </InputAdornment>
        )}
      />
    </div>
  );
};

EmbedHTML.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  createEmbedHTML: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  setBoundsRef: PropTypes.func.isRequired,
  restrictBounds: PropTypes.bool.isRequired,
};

export default EmbedHTML;
