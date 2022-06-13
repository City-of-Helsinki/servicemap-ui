import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ArrowDropDown } from '@mui/icons-material';
import SMButton from '../../ServiceMapButton';

const TitledList = ({
  children,
  classes,
  buttonMessageID,
  buttonMessageCount,
  buttonID,
  title,
  titleComponent,
  divider,
  onButtonClick,
  loading,
  subtitle,
  description,
}) => {
  const list = children;

  return (
    <>
      {title ? (
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
      ) : null}
      {description && (
        <Typography align="left" className={classes.description}>{description}</Typography>
      )}
      {divider ? (
        <Divider className={classes.divider} aria-hidden="true" />
      ) : null }

      <List disablePadding>
        {list}
      </List>
      {buttonMessageID && onButtonClick && !loading && (
        <SMButton
          id={buttonID}
          role="link"
          small
          messageID={buttonMessageID}
          messageCount={buttonMessageCount}
          icon={<ArrowDropDown className={classes.buttonIcon} />}
          textVariant="button"
          onClick={(e) => {
            e.preventDefault();
            onButtonClick();
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
  buttonMessageID: PropTypes.string,
  children: PropTypes.node.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  subtitle: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  buttonMessageCount: PropTypes.number,
  divider: PropTypes.bool,
  onButtonClick: PropTypes.func,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  loading: PropTypes.bool,
};

TitledList.defaultProps = {
  buttonID: null,
  titleComponent: 'h3',
  divider: true,
  onButtonClick: null,
  title: null,
  description: null,
  buttonMessageCount: null,
  subtitle: null,
  buttonMessageID: null,
  loading: false,
};

export default TitledList;
