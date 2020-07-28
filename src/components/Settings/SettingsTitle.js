import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Container from '../Container';

const SettingsTitle = ({
  classes, close, id, intl, titleID, typography,
}) => (
  <Container className={`${classes.titleContainer} ${close ? classes.flexReverse : ''}`}>
    {
      close
      && (
        <Button
          aria-label={intl.formatMessage({ id: 'general.closeSettings' })}
          className={`${classes.flexBase} ${classes.button}`}
          classes={{ label: classes.buttonLabel }}
          onClick={() => {
            close();
          }}
        >
          <Close />
          <FormattedMessage id="general.close" />
        </Button>
      )
    }
    <Typography id={id} className={classes.titleText} component="h3" variant="caption" align="left" {...typography}>
      <FormattedMessage id={titleID} />
    </Typography>
  </Container>
);

SettingsTitle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  close: PropTypes.func,
  id: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  titleID: PropTypes.string.isRequired,
  typography: PropTypes.objectOf(PropTypes.any),
};

SettingsTitle.defaultProps = {
  close: null,
  id: null,
  typography: { component: 'h3' },
};

export default SettingsTitle;
