import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit,
    position: 'relative',
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
    children, classes, paper, title, titleComponent, ...rest
  } = props;

  const ContainerComponent = paper ? Paper : DivWrapper;
  return (
    <ContainerComponent className={classes.root} {...rest}>
      {
        title
        && <Title className={classes.title} component={titleComponent} text={title} variant="h6" />
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
  titleComponent: 'h3',
};

export default withStyles(styles)(Container);
