import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Typography } from '@material-ui/core';
import Container from '../Container';

const PaperButton = ({
  classes, intl, disabled, messageID, onClick, icon, link, subtitleID, noBorder,
}) => {
  const clonedIcon = icon ? React.cloneElement(icon, { className: classes.icon }) : null;
  const role = link ? 'link' : 'button';
  const containerClass = `${classes.container} ${disabled ? classes.buttonDisabled : ''} ${noBorder ? classes.noBorder : ''}`;
  return (
    <Container paper className={containerClass}>
      <Button
        classes={{
          label: classes.iconButtonLabel,
        }}
        className={classes.iconButton}
        onClick={onClick}
        role={role}
        disabled={disabled}
        aria-label={`${intl.formatMessage({ id: messageID })} ${subtitleID ? intl.formatMessage({ id: subtitleID }) : ''}`}
      >
        <div className={`${classes.iconContainer} ${disabled ? classes.iconDisabled : ''}`}>
          {clonedIcon}
        </div>
        <div>
          <Typography aria-hidden variant="body2" className={classes.text}>
            <FormattedMessage id={messageID} />
          </Typography>
          {
            subtitleID
            && (
              <Typography aria-hidden variant="caption" className={classes.text}>
                <FormattedMessage id={subtitleID} />
              </Typography>
            )
          }
        </div>
      </Button>
    </Container>
  );
};

PaperButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  link: PropTypes.bool,
  noBorder: PropTypes.bool,
  onClick: PropTypes.func,
  messageID: PropTypes.string.isRequired,
  subtitleID: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

PaperButton.defaultProps = {
  disabled: false,
  icon: null,
  link: false,
  noBorder: false,
  onClick: null,
  subtitleID: null,
};


export default PaperButton;
