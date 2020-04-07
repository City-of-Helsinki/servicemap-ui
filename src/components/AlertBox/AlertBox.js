import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, IconButton, Link } from '@material-ui/core';
import { Cancel, ErrorOutline } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';

// This component uses default message inserted to code for now until proper implementation

const AlertBox = ({
  title, text, classes, intl,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className={classes.container}>
      <ErrorOutline className={classes.infoIcon} />
      <div className={classes.textContent}>
        <Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="inherit"
        >
          {title || <FormattedMessage id="alert.title" />}
        </Typography>

        {text ? (
          <Typography className={classes.messageText} color="inherit">{text}</Typography>
        ) : (
          <Typography className={classes.messageText} color="inherit">
            <FormattedMessage id="alert.text" />
            <Link
              href={intl.formatMessage({ id: 'alert.link.helsinki' })}
              target="_blank"
              rel="noopener"
              underline="always"
              color="inherit"
            >
              <FormattedMessage id="settings.city.helsinki" />
            </Link>
            {', '}

            <Link
              href={intl.formatMessage({ id: 'alert.link.espoo' })}
              target="_blank"
              rel="noopener"
              underline="always"
              color="inherit"
            >
              <FormattedMessage id="settings.city.espoo" />
            </Link>
            {', '}

            <Link
              href={intl.formatMessage({ id: 'alert.link.vantaa' })}
              target="_blank"
              rel="noopener"
              underline="always"
              color="inherit"
            >
              <FormattedMessage id="settings.city.vantaa" />
            </Link>
            {', '}

            <Link
              href={intl.formatMessage({ id: 'alert.link.kauniainen' })}
              target="_blank"
              rel="noopener"
              underline="always"
              color="inherit"
            >
              <FormattedMessage id="settings.city.kauniainen" />
            </Link>
          </Typography>
        )}
      </div>
      <IconButton
        aria-label={intl.formatMessage({ id: 'alert.close' })}
        onClick={() => setVisible(false)}
        className={classes.closeButton}
        color="inherit"
      >
        <Cancel className={classes.cancelIcon} />
      </IconButton>
    </div>
  );
};

/* TODO: Once the alert text is received properly,
(not by inseting to code) these props should be changed to isRequired */

AlertBox.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

AlertBox.defaultProps = {
  title: null,
  text: null,
};

export default AlertBox;
