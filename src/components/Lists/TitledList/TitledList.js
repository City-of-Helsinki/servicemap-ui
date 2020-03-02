import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import SMButton from '../../ServiceMapButton';

const TitledList = ({
  children,
  classes,
  buttonMessageID,
  buttonID,
  title,
  titleComponent,
  divider,
  showMoreOnClick,
  shortened,
  loading,
  subtitle,
}) => {
  const list = children;

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
        <Divider className={classes.divider} aria-hidden="true" />
      ) : null }

      <List disablePadding>
        {list}
      </List>
      {shortened && showMoreOnClick && !loading && (
        <SMButton
          id={buttonID}
          role="link"
          messageID={buttonMessageID}
          onClick={(e) => {
            e.preventDefault();
            showMoreOnClick();
          }}
          margin
        />
      )}
      {loading && (
        <Typography aria-live="polite" className={classes.loadingText}>
          <FormattedMessage id="general.loading" />
        </Typography>
      )}
    </>
  );
};

TitledList.propTypes = {
  buttonID: PropTypes.string,
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  divider: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  showMoreOnClick: PropTypes.func,
  buttonMessageID: PropTypes.string,
  loading: PropTypes.bool,
  shortened: PropTypes.bool,
};

TitledList.defaultProps = {
  buttonID: null,
  titleComponent: 'h3',
  divider: true,
  showMoreOnClick: null,
  subtitle: null,
  buttonMessageID: null,
  loading: false,
  shortened: false,
};

export default TitledList;
