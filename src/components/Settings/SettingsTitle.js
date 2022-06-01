import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography,
} from '@mui/material';
import Container from '../Container';
import CloseButton from '../CloseButton';

const SettingsTitle = ({
  classes, close, id, intl, titleID, typography,
}) => (
  <Container className={`${classes.titleContainer} ${close ? classes.flexReverse : ''}`}>
    {
      close
      && (
        <CloseButton
          aria-label={intl.formatMessage({ id: 'general.closeSettings' })}
          onClick={close}
        />
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
