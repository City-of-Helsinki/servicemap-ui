import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import styled from '@emotion/styled';

const Title = (props) => {
  const { text } = props;
  return (
    <Typography {...props}>{text}</Typography>
  );
};

Title.propTypes = {
  text: PropTypes.string.isRequired,
};

const containerStyles = ({ theme, nomargin, text, margin }) => {
  const styles = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    position: 'relative',
  };
  if (nomargin) {
    Object.assign(styles, {
      margin: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    });
  }
  if (text) {
    Object.assign(styles, {
      textAlign: 'left',
    });
  }
  if (margin) {
    Object.assign(styles, {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    });
  }
  return styles;
};

const StyledDiv = styled('div')(containerStyles);
const StyledPaper = styled(Paper)(containerStyles);

const Container = (props) => {
  const {
    className = '',
    children,
    margin = false,
    noMargin = false,
    paper = false,
    text = false,
    title = null,
    titleComponent = 'h3',
    ...rest
  } = props;

  const ContainerComponent = paper ? StyledPaper : StyledDiv;
  return (
    <ContainerComponent
      nomargin={noMargin || undefined}
      text={text}
      margin={(!noMargin && (paper || margin)) || undefined}
      className={`${className}`}
      {...rest}
    >
      {
        title
        && <StyledTitle component={titleComponent} text={title} variant="h6" />
      }
      {children}
    </ContainerComponent>
  );
};

const StyledTitle = styled(Title)(() => ({
  textAlign: 'left',
}));

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  margin: PropTypes.bool,
  noMargin: PropTypes.bool,
  paper: PropTypes.bool,
  text: PropTypes.bool,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
};

export default Container;
