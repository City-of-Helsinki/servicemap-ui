import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, List, ListItem, ListItemIcon, ListItemText, Divider, NoSsr, Link,
} from '@mui/material';
import { Warning, VerifiedUser } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import {
  getSelectedUnit,
  selectSelectedUnitAccessibilitySentences,
} from '../../../../redux/selectors/selectedUnit';
import { selectSettings } from '../../../../redux/selectors/settings';
import SettingsUtility from '../../../../utils/settings';
import useLocaleText from '../../../../utils/useLocaleText';
import { Container, Loading } from '../../../../components';

const AccessibilityInfo = (props) => {
  const {
    classes, titleAlways, headingLevel,
  } = props;
  const settings = useSelector(selectSettings);
  const unit = useSelector(getSelectedUnit);
  const accessibilitySentences = useSelector(selectSelectedUnitAccessibilitySentences);

  const getLocaleText = useLocaleText();

  if (!unit) {
    return null;
  }

  /**
   * Parse accessibility shortcomings to single array based on user's settings
   */
  const parseAccessibilityShortcomings = () => {
    const accessibilityShortcomings = unit.accessibility_description;

    if (!accessibilityShortcomings) {
      return null;
    }

    const accessibilitySettings = SettingsUtility.accessibilityRelatedSettings;

    // Create shortcoming array from current settings
    const shortcomingSettings = [];
    Object.keys(settings).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        const item = settings[key];
        // Confirm accessibility values
        // both radio values using item and checkbox values using key
        if (accessibilitySettings.includes(key) || accessibilitySettings.includes(item)) {
          if (typeof item === 'string') {
            shortcomingSettings.push(item);
          } if (typeof item === 'boolean' && item === true) {
            shortcomingSettings.push(SettingsUtility.getApiValidDataKey(key));
          }
        }
      }
    });

    if (!shortcomingSettings.length) {
      return 'noSettings';
    }

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
  };

  const renderAccessibilityShortcomings = (heading, shortcomings) => {
    const data = shortcomings;

    if (!data || data === 'noSettings' || data.length === 0) {
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
                    <Typography className={`AccessibilityInfoShortcomingTitle ${classes.listTitle}`} component={heading} variant="body2" align="left">
                      {title}
                    </Typography>
                    <ul className={classes.list}>
                      {
                        shortcomings.map(shortcoming => (
                          <li key={shortcoming} className={`AccessibilityInfoShortcoming ${classes.listItem}`}>
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
  };

  const renderAccessibilityDescriptions = (heading) => {
    const { data } = accessibilitySentences;
    if (!data) {
      return null;
    }

    // Figure out heading levels
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
  };

  const renderInfoText = (noInfo, noShortcomings) => {
    if (!noInfo && !noShortcomings) return null;
    return (
      <div className={classes.infoContainer}>
        {noInfo && (
          <>
            <Warning className={classes.infoIcon} />
            <Typography component="p" variant="body2" align="left">
              <FormattedMessage id="unit.accessibility.unitNoInfo" />
            </Typography>
          </>
        )}
        {noShortcomings && (
          <>
            <VerifiedUser className={classes.infoIcon} />
            <Typography component="p" variant="body2" align="left">
              <FormattedMessage id="unit.accessibility.noShortcomings" />
            </Typography>
          </>
        )}
      </div>
    );
  };

  if (headingLevel < 1 || headingLevel > 5) {
    throw Error('Heading level is invalid');
  }
  const shortcomings = parseAccessibilityShortcomings();
  const { data } = accessibilitySentences;
  const shouldRenderExtraTitle = data && Object.keys(data.groups).length
  && Object.keys(data.sentences).length;

  const heading = `h${headingLevel}`;
  const listHeading = (titleAlways || shouldRenderExtraTitle) ? `h${headingLevel + 1}` : heading;
  const aShortcomings = renderAccessibilityShortcomings(listHeading, shortcomings);
  const aDescriptions = renderAccessibilityDescriptions(listHeading);
  const noInfo = !aDescriptions && !aShortcomings;
  const noShortcomings = aDescriptions && !aShortcomings;

  const infoText = renderInfoText(noInfo, noShortcomings);

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
          shouldRenderExtraTitle
            ? (
              <>
                <Typography className={classes.descriptionsTitle} component={heading} variant="subtitle1" align="left">
                  <FormattedMessage id="accessibility.details" />
                  {unit.accessibility_www ? (
                    <Link target="_blank" href={unit.accessibility_www}>
                      <FormattedMessage id="accessibility.details.summary" />
                    </Link>
                  ) : null}
                </Typography>
                <Divider className={classes.divider} aria-hidden="true" />
              </>
            ) : null
        }
      <Loading reducer={accessibilitySentences}>
        { aDescriptions }
      </Loading>
    </Container>
  );
};

AccessibilityInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  headingLevel: PropTypes.oneOf([2, 3, 4, 5]).isRequired,
  titleAlways: PropTypes.bool,
};

AccessibilityInfo.defaultProps = {
  titleAlways: false,
};


export default AccessibilityInfo;
