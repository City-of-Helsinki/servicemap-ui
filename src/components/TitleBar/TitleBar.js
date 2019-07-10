import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, Typography,
} from '@material-ui/core';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import Container from '../Container/Container';
import BackButton from '../BackButton';

const styles = theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
  },
  mobileContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    backgroundColor: theme.palette.primary.main,
    height: 56,
  },
  title: {
    flex: '1 1 auto',
    textTransform: 'capitalize',
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
  },
  mobileTitle: {
    flex: '1 1 auto',
    textTransform: 'capitalize',
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
    color: '#ffffff',
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: '#ffffff',
  },
});

const TitleBar = ({
  classes, title, titleComponent, icon, backButtonEvent,
}) => (
  <>
    <MobileComponent>
      <div className={classes.mobileContainer}>
        <BackButton
          onClick={backButtonEvent}
          className={classes.iconButton}
          variant="icon"
        />
        <Typography
          className={classes.mobileTitle}
          component={titleComponent}
          text={title}
          variant="h6"
          tabIndex="-1"
          noWrap
        >
          {title}
        </Typography>
      </div>
    </MobileComponent>

    <DesktopComponent>
      <Container>
        <div className={classes.container}>
          <div style={{ height: 24, margin: 8, marginRight: 16 }} aria-hidden="true">
            {icon}
          </div>
          <Typography
            className={classes.title}
            component={titleComponent}
            text={title}
            variant="h6"
            tabIndex="-1"
          >
            {title}
          </Typography>
        </div>
      </Container>
    </DesktopComponent>
  </>
);

TitleBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  icon: PropTypes.objectOf(PropTypes.any),
  backButtonEvent: PropTypes.func,
};

TitleBar.defaultProps = {
  titleComponent: 'h3',
  icon: null,
  backButtonEvent: null,
};
export default withStyles(styles)(TitleBar);
