import styled from '@emotion/styled';
import { VerifiedUser, Warning } from '@mui/icons-material';
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  NoSsr,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { Container, Loading } from '../../../../components';
import {
  getSelectedUnit,
  selectSelectedUnitAccessibilitySentences,
} from '../../../../redux/selectors/selectedUnit';
import { selectSettings } from '../../../../redux/selectors/settings';
import SettingsUtility from '../../../../utils/settings';
import useLocaleText from '../../../../utils/useLocaleText';

function AccessibilityInfo({ titleAlways = false, headingLevel }) {
  const settings = useSelector(selectSettings);
  const unit = useSelector(getSelectedUnit);
  const accessibilitySentences = useSelector(
    selectSelectedUnitAccessibilitySentences
  );
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
        if (
          accessibilitySettings.includes(key) ||
          accessibilitySettings.includes(item)
        ) {
          if (typeof item === 'string') {
            shortcomingSettings.push(item);
          }
          if (typeof item === 'boolean' && item === true) {
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

    return (
      data &&
      data.length && (
        <List>
          {data.map((item) => {
            const title = getLocaleText(item.title);
            const { profiles } = item;
            let shortcomings = [];
            profiles.forEach((profile) => {
              if (profile.shortcomings.length > 0) {
                shortcomings = [
                  ...shortcomings,
                  ...profile.shortcomings.map((shortcoming) =>
                    getLocaleText(shortcoming)
                  ),
                ];
              }
            });
            return (
              <StyledListItemAdjustLeft key={title}>
                <StyledListItemIcon>
                  <Warning />
                </StyledListItemIcon>
                <ListItemText>
                  <StyledListTitle
                    data-sm="AccessibilityInfoShortcomingTitle"
                    component={heading}
                    variant="body2"
                    align="left"
                  >
                    {title}
                  </StyledListTitle>
                  <StyledList>
                    {shortcomings.map((shortcoming) => (
                      <StyledListItem
                        key={shortcoming}
                        data-sm="AccessibilityInfoShortcoming"
                      >
                        <Typography component="p" variant="body2">
                          {shortcoming}
                        </Typography>
                      </StyledListItem>
                    ))}
                  </StyledList>
                </ListItemText>
              </StyledListItemAdjustLeft>
            );
          })}
        </List>
      )
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
      <List>
        {groupArray.map((key) => {
          if (Object.prototype.hasOwnProperty.call(groups, key)) {
            let groupSentences;
            const group = groups[key];
            const title = getLocaleText(group);

            if (Object.prototype.hasOwnProperty.call(sentences, key)) {
              groupSentences = sentences[key];
            }

            if (groupSentences && groupSentences.length > 0) {
              return (
                <StyledDescriptionItem key={title}>
                  <ListItemText>
                    <StyledListTitle
                      component={heading}
                      variant="body2"
                      align="left"
                    >
                      {title}
                    </StyledListTitle>
                    <StyledList>
                      {groupSentences.map((sentence) => {
                        const text = getLocaleText(sentence);
                        return (
                          <StyledListItem key={text}>
                            <Typography
                              component="p"
                              variant="body2"
                              align="left"
                            >
                              {text}
                            </Typography>
                          </StyledListItem>
                        );
                      })}
                    </StyledList>
                  </ListItemText>
                </StyledDescriptionItem>
              );
            }
          }
          return null;
        })}
      </List>
    );
  };

  const renderInfoText = (noInfo, noShortcomings) => {
    if (!noInfo && !noShortcomings) return null;
    return (
      <InfoContainer data-sm="InfoContainer">
        {noInfo && (
          <>
            <StyledWarningInfoIcon />
            <Typography component="p" variant="body2" align="left">
              <FormattedMessage id="unit.accessibility.unitNoInfo" />
            </Typography>
          </>
        )}
        {noShortcomings && (
          <>
            <StyledVerifiedUserInfoIcon />
            <Typography component="p" variant="body2" align="left">
              <FormattedMessage id="unit.accessibility.noShortcomings" />
            </Typography>
          </>
        )}
      </InfoContainer>
    );
  };

  if (headingLevel < 1 || headingLevel > 5) {
    throw Error('Heading level is invalid');
  }
  const shortcomings = parseAccessibilityShortcomings();
  const { data } = accessibilitySentences;
  const shouldRenderExtraTitle =
    data &&
    Object.keys(data.groups).length &&
    Object.keys(data.sentences).length;

  const heading = `h${headingLevel}`;
  const listHeading =
    titleAlways || shouldRenderExtraTitle ? `h${headingLevel + 1}` : heading;
  const aShortcomings = renderAccessibilityShortcomings(
    listHeading,
    shortcomings
  );
  const aDescriptions = renderAccessibilityDescriptions(listHeading);
  const noInfo = !aDescriptions && !aShortcomings;
  const noShortcomings = aDescriptions && !aShortcomings;

  const infoText = renderInfoText(noInfo, noShortcomings);

  return (
    <Container>
      {titleAlways && (
        <StyledTitle variant="subtitle1" component={heading} align="left">
          <FormattedMessage id="accessibility.info" />
        </StyledTitle>
      )}
      <StyledDivider aria-hidden="true" />
      <NoSsr>
        {infoText}
        {aShortcomings}
      </NoSsr>
      {shouldRenderExtraTitle ? (
        <>
          <StyledDescriptionsTitle
            component={heading}
            variant="subtitle1"
            align="left"
          >
            <FormattedMessage id="accessibility.details" />
            {unit.accessibility_www ? (
              <Link target="_blank" href={unit.accessibility_www}>
                <FormattedMessage id="accessibility.details.summary" />
              </Link>
            ) : null}
          </StyledDescriptionsTitle>
          <StyledDivider aria-hidden="true" />
        </>
      ) : null}
      <Loading reducer={accessibilitySentences}>{aDescriptions}</Loading>
    </Container>
  );
}

const infoIconClass = ({ theme }) => ({
  paddingRight: theme.spacing(2),
  color: theme.palette.primary.main,
});

const StyledWarningInfoIcon = styled(Warning)(infoIconClass);
const StyledVerifiedUserInfoIcon = styled(VerifiedUser)(infoIconClass);
const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const InfoContainer = styled.div(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  paddingLeft: 0,
  paddingRight: 0,
  alignItems: 'center',
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  alignSelf: 'flex-start',
  margin: 0,
  color: theme.palette.primary.main,
  marginTop: '-3px',
  marginRight: theme.spacing(2),
  minWidth: 0,
}));

const StyledListTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
}));

const StyledDescriptionItem = styled(ListItem)(({ theme }) => ({
  marginLeft: theme.spacing(3),
}));

const StyledListItemAdjustLeft = styled(ListItem)(({ theme }) => ({
  marginLeft: theme.spacing(-2),
}));

const StyledList = styled.ul(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  listStyleType: 'disc',
}));

const StyledListItem = styled.li(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const StyledDivider = styled(Divider)(() => ({
  marginLeft: -32,
  marginRight: -32,
}));

const StyledDescriptionsTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

AccessibilityInfo.propTypes = {
  headingLevel: PropTypes.oneOf([2, 3, 4, 5]).isRequired,
  titleAlways: PropTypes.bool,
};

export default AccessibilityInfo;
