import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, TextField, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { getEmbedURL } from '../utils/utils';


/**
   * Renders embed HTMl based on options
*/
const EmbedHTML = ({
  classes, createEmbedHTML, url, setBoundsRef, restrictBounds,
}) => {
  const intl = useIntl();
  const [bbox, setBbox] = useState(null);

  const embedUrl = getEmbedURL(url, { bbox: restrictBounds ? bbox : null });

  const handleEventMessage = (event) => {
    // Update bbox on map move
    if (event.data.bbox) {
      setBoundsRef(event.data.bbox);
      setBbox(event.data.bbox);
    }
  };

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
    <Paper className={classes.formContainerPaper}>
      {
          /* Embed address */
        }
      <Typography
        align="left"
        className={classes.marginBottom}
        variant="h5"
        component="h2"
      >
        <FormattedMessage id="embedder.url.title" />
      </Typography>
      <TextField
        id="embed-address"
        className={textFieldClass}
        value={embedUrl}
        margin="normal"
        variant="outlined"
        inputProps={{ 'aria-label': intl.formatMessage({ id: 'embedder.url.title' }) }}
      />
      {
          /* Embed HTML code */
        }
      <Typography
        align="left"
        className={classes.marginBottom}
        variant="h5"
        component="h2"
      >
        <FormattedMessage id="embedder.code.title" />
      </Typography>
      <pre className={classes.pre}>
        { htmlText }
      </pre>
    </Paper>
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
