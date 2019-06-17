/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  Typography,
  IconButton,
  withStyles,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Container from '../Container';
import styles from './styles';

const SettingsTitle = injectIntl(withStyles(styles)(({
  classes, close, intl, titleID, ...typography
}) => (
  <Container className={`${classes.titleContainer} ${close ? classes.flexReverse : ''}`}>
    {
      close
      && (
        <IconButton
          aria-label={intl.formatMessage({ id: 'general.closeSettings' })}
          className={classes.closeButton}
          onClick={() => {
            close();
          }}
        >
          <Close />
        </IconButton>
      )
    }
    <Typography component="h3" variant="caption" align="left" style={{ margin: 8 }} {...typography}>
      <FormattedMessage id={titleID} />
    </Typography>
  </Container>
)));

SettingsTitle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  close: PropTypes.func,
  intl: intlShape,
  titleID: PropTypes.string.isRequired,
};

SettingsTitle.defaultProps = {
  close: null,
};

export default SettingsTitle;
