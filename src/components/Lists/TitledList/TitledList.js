import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography, Divider,
} from '@material-ui/core';
import styles from './styles';
import ServiceMapButton from '../../ServiceMapButton';

const TitledList = ({
  children, classes, title, titleComponent, divider, showMoreOnClick, listLength, buttonText,
}) => {
  let shortened = false;
  let list = children;

  if (listLength && children.length > listLength) {
    // TODO: instead of slicing the fullList, fetch only the amount needed.
    list = children.slice(0, listLength);
    shortened = true;
  }

  return (
    <>
      <Typography
        className={`${classes.title} ${classes.left}`}
        component={titleComponent}
        variant="subtitle1"
      >
        {title}
      </Typography>
      {divider ? (
        <Divider aria-hidden="true" className={classes.left} />
      ) : null }

      <List disablePadding>
        {list}
      </List>
      {shortened && showMoreOnClick && (
        <ServiceMapButton onClick={showMoreOnClick}>
          {buttonText}
        </ServiceMapButton>
      )}
    </>
  );
};

TitledList.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  divider: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  showMoreOnClick: PropTypes.func,
  listLength: PropTypes.number,
  buttonText: PropTypes.objectOf(PropTypes.any),
};

TitledList.defaultProps = {
  titleComponent: 'h3',
  divider: true,
  showMoreOnClick: null,
  listLength: null,
  buttonText: null,
};

export default withStyles(styles)(TitledList);
