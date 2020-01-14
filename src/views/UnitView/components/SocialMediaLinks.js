import React from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, withStyles, Divider, Typography,
} from '@material-ui/core';
import DefaultIcon from '@material-ui/icons/Public';
import { FormattedMessage } from 'react-intl';
import unitSectionFilter from '../utils/unitSectionFilter';
import { getIcon } from '../../../components/SMIcon';
import socialMediaLinksStyles from '../styles/socialMediaLinksStyles';

const SocialMediaLinks = ({ unit, getLocaleText, classes }) => {
  const links = unitSectionFilter(unit.connections, 'SOCIAL_MEDIA_LINK');
  const columns = 3;

  if (links.length) {
    return (
      <div className={classes.someListContainer}>
        <Typography className={classes.someTitle}><FormattedMessage id="unit.socialMedia.title" /></Typography>
        <List className={classes.someList}>
          {links.map((link, i) => (
            <>
              <ListItem
                disableGutters
                button
                role="link"
                component="li"
                onClick={() => link.value.www && window.open(getLocaleText(link.value.www))}
                key={link.id}
                className={classes.someItem}
              >
                {getIcon(link.value.name.fi.toLowerCase())
                  || <DefaultIcon className={classes.defaultIcon} />
                }
                <Typography className={classes.itemText}>
                  {getLocaleText(link.value.name)}
                </Typography>
              </ListItem>
              {(i + 1 === links.length || (i + 1) % columns === 0)
                ? null : ( // Dont draw divider if last of list or last of row
                  <ListItem aria-hidden className={classes.verticalDividerContainer}>
                    <span className={classes.verticalDivider} />
                  </ListItem>
                )
              }
            </>
          ))}
        </List>
        <Divider aria-hidden className={classes.someDivider} />
      </div>
    );
  } return null;
};

SocialMediaLinks.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

SocialMediaLinks.defaultProps = {
};


export default withStyles(socialMediaLinksStyles)(SocialMediaLinks);
