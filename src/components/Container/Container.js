import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  title: {
    textAlign: 'left',
  },
});

const Title = (props) => {
  const { text } = props;
  return (
    <Typography {...props}>{text}</Typography>
  );
};

Title.propTypes = {
  text: PropTypes.string.isRequired,
};

const DivWrapper = props => (
  <div {...props} />
);

const Container = (props) => {
  const {
    children, classes, paper, title, titleComponent,
  } = props;

  const ContainerComponent = paper ? Paper : DivWrapper;
  return (
    <ContainerComponent className={classes.root}>
      {
        title
        && <Title className={classes.title} component={titleComponent || 'h3'} text={title} variant="h6" />
      }
      {children}
    </ContainerComponent>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  paper: PropTypes.bool,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

Container.defaultProps = {
  paper: false,
  title: null,
  titleComponent: null,
};

export default withStyles(styles)(Container);
