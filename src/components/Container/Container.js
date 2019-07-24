import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@material-ui/core';

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
    className, children, classes, margin, noMargin, paper, text, title, titleComponent, ...rest
  } = props;

  const ContainerComponent = paper ? Paper : DivWrapper;
  return (
    <ContainerComponent className={`${classes.root} ${(!noMargin && (paper || margin)) ? classes.margin : ''} ${noMargin ? classes.noMargin : ''} ${text ? classes.text : ''} ${className}`} {...rest}>
      {
        title
        && <Title className={classes.title} component={titleComponent} text={title} variant="h6" />
      }
      {children}
    </ContainerComponent>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  margin: PropTypes.bool,
  noMargin: PropTypes.bool,
  paper: PropTypes.bool,
  text: PropTypes.bool,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

Container.defaultProps = {
  className: '',
  margin: false,
  noMargin: false,
  paper: false,
  text: false,
  title: null,
  titleComponent: 'h3',
};

export default Container;
