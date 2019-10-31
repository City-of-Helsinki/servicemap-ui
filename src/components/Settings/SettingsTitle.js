import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import {
  Typography,
  Button,
} from '@material-ui/core';
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
          className={`${classes.flexBase}`}
          color="primary"
          onClick={() => {
            close();
          }}
          variant="text"
        >
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
