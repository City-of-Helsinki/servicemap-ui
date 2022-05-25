import { Divider, ListItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import useLocaleText from '../../../utils/useLocaleText';
import { AreaIcon } from '../../SMIcon';

export const DistrictItemComponent = ({
  area,
  classes,
  hideDivider,
  paddedDivider,
  title,
}) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  if (!area || !area.id || !area.type || !area.origin_id) {
    return null;
  }

  const titleText = intl.formatMessage({ id: `area.list.${area.type}` });
  const getCustomRescueAreaTitle = area => `${!title ? `${titleText} ` : ''}${area.origin_id} - ${getLocaleText(area.name)}`;
  const dividerClasses = `${classes.divider} ${paddedDivider ? classes.padding : ''}`;

  return (
    <Fragment key={area.id}>
      <ListItem className={classes.simpleItem}>
        {
          title
          && (
            <Typography className={classes.simpleTitle} variant="subtitle1">
              {titleText}
            </Typography>
          )
        }
        <div className={classes.itemTextContainer}>
          <AreaIcon className={classes.areaIcon} />
          <Typography className={classes.boldText}>
            {getCustomRescueAreaTitle(area)}
          </Typography>
        </div>
      </ListItem>
      {
        !hideDivider
        && (
          <li aria-hidden className={dividerClasses}>
            <Divider aria-hidden />
          </li>
        )
      }
    </Fragment>
  );
};

DistrictItemComponent.propTypes = {
  area: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.objectOf(PropTypes.any).isRequired,
    origin_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    areaIcon: PropTypes.string.isRequired,
    boldText: PropTypes.string.isRequired,
    divider: PropTypes.string.isRequired,
    itemTextContainer: PropTypes.string.isRequired,
    simpleItem: PropTypes.string.isRequired,
    simpleTitle: PropTypes.string.isRequired,
    padding: PropTypes.string.isRequired,
  }).isRequired,
  hideDivider: PropTypes.bool,
  paddedDivider: PropTypes.bool,
  title: PropTypes.bool,
};

DistrictItemComponent.defaultProps = {
  hideDivider: false,
  paddedDivider: false,
  title: true,
};

export default DistrictItemComponent;
