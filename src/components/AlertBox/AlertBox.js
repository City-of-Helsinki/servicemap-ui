import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { getIcon } from '../SMIcon';
import LocalStorageUtility from '../../utils/localStorage';

// LocalStorage key for alert message
const lsKey = 'alertMessage';

const AlertBox = ({
  classes, getLocaleText, intl, errors, news,
}) => {
  const [visible, setVisible] = useState(true);
  const isErrorMessage = !!errors.length;
  const abData = isErrorMessage ? errors : news;
  const savedMessage = LocalStorageUtility.getItem(lsKey);

  if (
    !visible
    || !abData.length
    || JSON.stringify(abData[0].title) === savedMessage
  ) {
    return null;
  }

  const setMessageAsWatched = () => {
    LocalStorageUtility.saveItem(lsKey, JSON.stringify(abData[0].title));
  };

  const { title, lead_paragraph: leadParagraph } = abData[0];
  const tTitle = getLocaleText(title);
  const tLeadParagraph = getLocaleText(leadParagraph);
  const icon = getIcon('servicemapLogoIcon', {
    className: classes.icon,
  });
  const closeButtonIcon = getIcon('closeIcon');
  const closeButtonText = intl.formatMessage({ id: 'general.close' });
  const closeButtonTextAria = intl.formatMessage({ id: 'general.news.alert.close.aria' });
  const closeButtonClick = () => {
    setVisible(false);
    setMessageAsWatched();
  };

  return (
    <section className={classes.container}>
      <Typography variant="srOnly" component="h2">
        <FormattedMessage id="general.news.alert.title" />
      </Typography>
      {icon}
      <div className={classes.textContent}>
        <Typography
          className={classes.title}
          component="h3"
          variant="subtitle1"
          color="inherit"
        >
          {tTitle}
        </Typography>
        <Typography className={classes.messageText} color="inherit">{tLeadParagraph}</Typography>
      </div>
      <div className={classes.padder} />
      <Button
        aria-label={closeButtonTextAria}
        color="inherit"
        classes={{
          endIcon: classes.endIcon,
        }}
        className={classes.closeButton}
        endIcon={closeButtonIcon}
        onClick={closeButtonClick}
      >
        {closeButtonText}
      </Button>
    </section>
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
