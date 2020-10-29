import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { getIcon } from '../SMIcon';

// This component uses default message inserted to code for now until proper implementation

const AlertBox = ({
  classes, getLocaleText, intl, errors, news,
}) => {
  const [visible, setVisible] = useState(true);
  const abData = errors.length ? errors : news;

  if (!visible || !abData.length) {
    return null;
  }

  const { title, lead_paragraph: leadParagraph } = abData[0];
  const tTitle = getLocaleText(title);
  const tLeadParagraph = getLocaleText(leadParagraph);
  const icon = getIcon('servicemapLogoIcon', {
    className: classes.icon,
  });
  const closeIcon = getIcon('closeIcon');
  const closeText = intl.formatMessage({ id: 'general.close' });

  return (
    <div className={classes.container}>
      {icon}
      <div className={classes.textContent}>
        <Typography
          className={classes.title}
          component="h2"
          variant="subtitle1"
          color="inherit"
        >
          {tTitle}
        </Typography>
        <Typography className={classes.messageText} color="inherit">{tLeadParagraph}</Typography>
      </div>
      <div className={classes.padder} />
      <Button
        color="inherit"
        classes={{
          endIcon: classes.endIcon,
        }}
        className={classes.closeButton}
        endIcon={closeIcon}
        onClick={() => setVisible(false)}
      >
        {closeText}
      </Button>
    </div>
  );
};

/* TODO: Once the alert text is received properly,
(not by inseting to code) these props should be changed to isRequired */

AlertBox.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    lead_paragraph: PropTypes.shape({
      fi: PropTypes.string,
    }),
    title: PropTypes.shape({
      fi: PropTypes.string,
    }),
  })).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  news: PropTypes.arrayOf(PropTypes.shape({
    lead_paragraph: PropTypes.shape({
      fi: PropTypes.string,
    }),
    title: PropTypes.shape({
      fi: PropTypes.string,
    }),
  })).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AlertBox;
