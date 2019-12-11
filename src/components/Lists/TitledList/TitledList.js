import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@material-ui/core';
import ServiceMapButton from '../../ServiceMapButton';

const TitledList = ({
  children,
  classes,
  buttonText,
  title,
  titleComponent,
  divider,
  showMoreOnClick,
  listLength,
  subtitle,
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
      <div className={`${classes.titleContainer} ${classes.marginHorizontal}`}>
        <Typography
          className={`${classes.left} ${classes.marginVertical}`}
          component={titleComponent}
          variant="subtitle1"
        >
          {title}
        </Typography>
        {
          subtitle
          && (
            <Typography
              className={`${classes.right} ${classes.marginVertical}`}
              component="p"
              variant="caption"
            >
              {subtitle}
            </Typography>
          )
        }
      </div>
      {divider ? (
        <Divider aria-hidden="true" />
      ) : null }

      <List disablePadding>
        {list}
      </List>
      {shortened && showMoreOnClick && (
        <ServiceMapButton
          text={buttonText}
          onClick={(e) => {
            e.preventDefault();
            showMoreOnClick();
          }}
        />
      )}
    </>
  );
};

TitledList.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
  subtitle: null,
  buttonText: null,
};

export default TitledList;
