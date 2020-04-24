import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { Cancel, ErrorOutline } from '@material-ui/icons';
import { intlShape } from 'react-intl';

const AlertBox = ({
  title, text, classes, intl,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const textIsString = typeof text === 'string';

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
          {title}
        </Typography>

        {
          textIsString
            ? (
              <Typography className={classes.messageText} color="inherit">{text}</Typography>
            )
            : text
        }
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
  title: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
};

export default AlertBox;
