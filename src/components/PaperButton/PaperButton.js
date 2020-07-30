import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Typography } from '@material-ui/core';
import Container from '../Container';

const PaperButton = ({
  classes, className, intl, disabled, messageID, onClick, icon, link, subtitleID, noBorder, role, ...rest,
}) => {
  const clonedIcon = icon ? React.cloneElement(icon, { className: classes.icon }) : null;
  const bRole = role || link ? 'link' : 'button';
  const containerClass = `${classes.container} ${disabled ? classes.buttonDisabled : ''} ${noBorder ? classes.noBorder : ''}${` ${className || ''}`}`;
  return (
    <Container paper className={containerClass}>
      <Button
        classes={{
          label: classes.iconButtonLabel,
        }}
        className={classes.iconButton}
        onClick={onClick}
        role={bRole}
        disabled={disabled}
        aria-label={`${intl.formatMessage({ id: messageID })} ${subtitleID ? intl.formatMessage({ id: subtitleID }) : ''}`}
        {...rest}
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
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  link: PropTypes.bool,
  noBorder: PropTypes.bool,
  onClick: PropTypes.func,
  messageID: PropTypes.string.isRequired,
  role: PropTypes.string,
  subtitleID: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

PaperButton.defaultProps = {
  className: null,
  disabled: false,
  icon: null,
  link: false,
  noBorder: false,
  onClick: null,
  role: null,
  subtitleID: null,
};


export default PaperButton;
