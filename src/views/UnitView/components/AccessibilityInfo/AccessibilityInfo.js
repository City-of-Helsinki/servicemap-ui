import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, List, ListItem, ListItemIcon, ListItemText, Divider, NoSsr,
} from '@material-ui/core';
import { Warning, VerifiedUser } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import Container from '../../../../components/Container';
import SettingsUtility from '../../../../utils/settings';

class AccessibilityInfo extends React.Component {
  /**
   * Parse accessibility shortcomings to single array based on user's settings
   */
  parseAccessibilityShortcomings() {
    const { settings, unit } = this.props;
    const accessibilityShortcomings = unit.accessibility_description;

    if (!accessibilityShortcomings) {
      return null;
    }

    const cities = ['helsinki', 'espoo', 'vantaa', 'kauniainen'];

    // Create shortcoming array from current settings
    const shortcomingSettings = [];
    Object.keys(settings).forEach((key) => {
      if (!cities.includes(key)) {
        if (Object.prototype.hasOwnProperty.call(settings, key)) {
          const item = settings[key];
          if (typeof item === 'string') {
            shortcomingSettings.push(item);
          } if (typeof item === 'boolean' && item === true) {
            shortcomingSettings.push(SettingsUtility.getApiValidDataKey(key));
          }
        }
      }
    });

    // Create shortcoming data
    const renderedShortcomings = [];

    accessibilityShortcomings.forEach((element) => {
      const { profiles } = element;
      if (profiles && profiles.length) {
        const newAccessibilityProfile = {
          title: element.title,
          profiles: [],
        };

        profiles.forEach((profile) => {
          // Check if profile id exist in current shorcoming settings
          if (shortcomingSettings.indexOf(profile.id) > -1) {
            newAccessibilityProfile.profiles.push(profile);
          }
        });

        if (newAccessibilityProfile.profiles.length) {
          renderedShortcomings.push(newAccessibilityProfile);
        }
      }
    });

    return renderedShortcomings;
  }

  renderAccessibilityShortcomings(heading, shortcomings) {
    const { classes, getLocaleText } = this.props;
    const data = shortcomings;

    if (!data || data.length === 0) {
      return null;
    }

    return data
      && data.length
      && (
        <>
          <List>
            {
            data.map((item) => {
              const title = getLocaleText(item.title);
              const { profiles } = item;
              let shortcomings = [];
              profiles.forEach((profile) => {
                if (profile.shortcomings.length > 0) {
                  shortcomings = [
                    ...shortcomings,
                    ...profile.shortcomings.map(shortcoming => (getLocaleText(shortcoming))),
                  ];
                }
              });
              return (
                <ListItem key={title} className={classes.adjustLeft}>
                  <ListItemIcon className={classes.listIcon}>
                    <Warning />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography className={classes.listTitle} component={heading} variant="body2" align="left">
                      {title}
                    </Typography>
                    <ul className={classes.list}>
                      {
                        shortcomings.map(shortcoming => (
                          <li key={shortcoming} className={classes.listItem}>
                            <Typography component="p" variant="body2">
                              {shortcoming}
                            </Typography>
                          </li>
                        ))
                      }
                    </ul>
                  </ListItemText>
                </ListItem>
              );
            })
          }
          </List>
        </>
      );
  }

  renderAccessibilityDescriptions(heading) {
    // Figure out heading levels
    const { accessibilitySentences, classes, getLocaleText } = this.props;
    const { data } = accessibilitySentences;
    if (!data) {
      return null;
    }
    const { groups, sentences } = data;

    const groupArray = Object.keys(groups);
    const sentenceArray = Object.keys(sentences);

    if (!groupArray.length || !sentenceArray.length) {
      return null;
    }

    return (
      <>
        <List>
          {
            groupArray.map((key) => {
              if (Object.prototype.hasOwnProperty.call(groups, key)) {
                let groupSentences;
                const group = groups[key];
                const title = getLocaleText(group);

                if (Object.prototype.hasOwnProperty.call(sentences, key)) {
                  groupSentences = sentences[key];
                }

                if (groupSentences && groupSentences.length > 0) {
                  return (
                    <ListItem className={classes.descriptionItem} key={title}>
                      <ListItemText>
                        <Typography className={classes.listTitle} component={heading} variant="body2" align="left">
                          {title}
                        </Typography>
                        <ul className={classes.list}>
                          {
                            groupSentences.map((sentence) => {
                              const text = getLocaleText(sentence);
                              return (
                                <li key={text} className={classes.listItem}>
                                  <Typography component="p" variant="body2" align="left">
                                    {text}
                                  </Typography>
                                </li>
                              );
                            })
                            }
                        </ul>
                      </ListItemText>
                    </ListItem>
                  );
                }
              }
              return null;
            })
          }
        </List>
      </>
    );
  }

  renderInfoText(noInfo, noShortcomings) {
    const { classes } = this.props;

    if (noInfo) {
      return (
        <ListItem component="div">
          <ListItemIcon>
            <Warning className={classes.noInfoColor} />
          </ListItemIcon>
          <Typography component="p" variant="body2" align="left">
            <FormattedMessage id="unit.accessibility.unitNoInfo" />
          </Typography>
        </ListItem>
      );
    }

    if (noShortcomings) {
      return (
        <ListItem component="div">
          <ListItemIcon>
            <VerifiedUser className={classes.noShortcomingsColor} />
          </ListItemIcon>
          <Typography component="p" variant="body2" align="left">
            <FormattedMessage id="unit.accessibility.noShortcomings" />
          </Typography>
        </ListItem>
      );
    }

    return null;
  }

  render() {
    const { classes, titleAlways, headingLevel } = this.props;

    if (headingLevel < 1 || headingLevel > 5) {
      throw Error('Heading level is invalid');
    }
    const shortcomings = this.parseAccessibilityShortcomings();

    const shouldRenderTitle = !!(shortcomings && shortcomings.length);


    const heading = `h${headingLevel}`;
    const listHeading = (titleAlways || shouldRenderTitle) ? `h${headingLevel + 1}` : heading;
    const aShortcomings = this.renderAccessibilityShortcomings(listHeading, shortcomings);
    const aDescriptions = this.renderAccessibilityDescriptions(listHeading);

    const noInfo = !aDescriptions && !aShortcomings;
    const noShortcomings = aDescriptions && !aShortcomings;

    const infoText = this.renderInfoText(noInfo, noShortcomings);

    return (
      <Container>
        {
          (titleAlways)
          && (
            <Typography className={classes.title} variant="subtitle1" component={heading} align="left">
              <FormattedMessage id="accessibility.info" />
            </Typography>
          )
        }
        <Divider className={classes.divider} aria-hidden="true" />
        <NoSsr>
          {
            infoText
          }
          {
            aShortcomings
          }
        </NoSsr>
        {
          shouldRenderTitle
          && (
            <>
              <Typography className={classes.title} component={heading} variant="subtitle1" align="left">
                <FormattedMessage id="accessibility.details" />
              </Typography>
              <Divider className={classes.divider} aria-hidden="true" />
            </>
          )
        }
        {
          aDescriptions
        }
      </Container>
    );
  }
}

AccessibilityInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  accessibilitySentences: PropTypes.shape({
    isFetching: PropTypes.bool,
    data: PropTypes.objectOf(PropTypes.shape({
      sentences: PropTypes.any,
      groups: PropTypes.any,
    })),
  }).isRequired,
  headingLevel: PropTypes.oneOf([2, 3, 4, 5]).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  titleAlways: PropTypes.bool,
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

AccessibilityInfo.defaultProps = {
  titleAlways: false,
};


export default AccessibilityInfo;
