import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, Typography,
} from '@material-ui/core';
import RootRef from '@material-ui/core/RootRef';
import Container from '../Container/Container';
import BackButton from '../BackButton';
import HomeButton from '../HomeButton';

const styles = theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
  },
  title: {
    flex: '1 1 auto',
    textTransform: 'capitalize',
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
});

const TitleBar = ({
  classes, title, titleComponent, titleRef,
}) => (
  <Container>
    <div className={classes.container}>
      <BackButton
        className={classes.iconButton}
      />
      <RootRef rootRef={titleRef}>
        <Typography
          className={classes.title}
          component={titleComponent}
          text={title}
          variant="h6"
          tabIndex="-1"
        >
          {title}
        </Typography>
      </RootRef>

      <HomeButton
        className={classes.icon}
      />
    </div>
  </Container>
);

TitleBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  titleRef: PropTypes.objectOf(PropTypes.any).isRequired,
};

TitleBar.defaultProps = {
  titleComponent: 'h3',
};
export default withStyles(styles)(TitleBar);
