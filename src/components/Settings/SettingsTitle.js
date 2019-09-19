import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import {
  Typography,
  IconButton,
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
    <Typography id={id} className={classes.titleText} component="h3" variant="caption" align="left" {...typography}>
      <FormattedMessage id={titleID} />
    </Typography>
  </Container>
);

SettingsTitle.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  close: PropTypes.func,
  id: PropTypes.string,
  intl: intlShape.isRequired,
  titleID: PropTypes.string.isRequired,
  typography: PropTypes.objectOf(PropTypes.any),
};

SettingsTitle.defaultProps = {
  close: null,
  id: null,
  typography: { component: 'h3' },
};

export default SettingsTitle;
