/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import isClient, { AddEventListener } from '../../utils';
import SettingsUtility from '../../utils/settings';
import Container from '../Container';
import {
  ColorblindIcon, HearingIcon, VisualImpairmentIcon, getIcon,
} from '../SMIcon';
import ServiceMapButton from '../ServiceMapButton';
import SettingsTitle from './SettingsTitle';

class Settings extends React.Component {
  events = [];

  buttonID = 'SettingsButton';

  constructor(props) {
    super(props);
    this.state = {
      alert: false,
      containerStyles: null,
      currentSettings: {},
      previousSettings: null,
      saved: false,
    };
  }

  componentDidMount() {
    const { current } = this.state;
    const { settings } = this.props;
    const {
      colorblind, hearingAid, mobility, visuallyImpaired,
    } = settings;

    // Create current settings from redux data
    const newCurrent = {
      ...current,
      colorblind,
      hearingAid,
      mobility: mobility !== null ? mobility : 'none',
      visuallyImpaired,
    };

    this.setState({
      containerStyles: this.calculateContainerStyles(),
      currentSettings: newCurrent,
      previousSettings: newCurrent,
    });

    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  /**
   * Check if settings have changed compared to redux settings
   */
  settingsHaveChanged() {
    const { currentSettings } = this.state;
    const { settings } = this.props;
    let changed = false;

    Object.keys(currentSettings).forEach((key) => {
      if (changed) {
        return;
      }

      const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
      const currentHasKey = Object.prototype.hasOwnProperty.call(currentSettings, key);
      if (settingsHasKey && currentHasKey) {
        const a = settings[key];
        let b = currentSettings[key];
        // Handle comparison with no mobility settings set
        if (key === 'mobility' && b === 'none') {
          b = null;
        }

        if (a !== b) {
          changed = true;
        }
      }
    });

    return changed;
  }

  setNewPreviousSettings(previousSettings) {
    this.setState({
      previousSettings,
      saved: true,
    });
  }

  setAlert(alert = false) {
    this.setState({
      alert,
    });
  }

  // Add event listeners
  addListeners() {
    if (!isClient()) {
      return;
    }

    // Add resize event listener to update container styles
    this.events.push(AddEventListener(window, 'resize', () => this.addContainerStyles()));
  }

  // Remove all event listeners
  removeListeners() {
    if (!this.events || !this.events.length) {
      return;
    }

    this.events.forEach(unlisten => unlisten());
  }

  addContainerStyles() {
    this.setState({
      containerStyles: this.calculateContainerStyles(),
    });
  }

  /**
   * Get style object for container
   */
  // eslint-disable-next-line class-methods-use-this
  calculateContainerStyles() {
    const { isMobile } = this.props;
    const styles = {};

    if (isClient()) {
      const sidebar = document.getElementsByClassName('SidebarWrapper')[0];
      if (!isMobile) {
        const rect = sidebar.getBoundingClientRect();
        styles.position = 'absolute';
        styles.top = rect.top;
        styles.left = rect.left;
        styles.width = rect.width;
        styles.height = rect.height;
        styles.overflow = 'auto';
      }
    }
    return styles;
  }

  /**
   * Toggle settings container visible/hidden
   */
  toggleSettingsContainer() {
    const { toggleSettings } = this.props;
    // Focus back to settings button if container will be closed
    this.focusToBaseElement();

    this.setState({
      saved: false,
    });
    toggleSettings();
  }

  // eslint-disable-next-line class-methods-use-this
  focusToBaseElement() {
    const elem = document.getElementById('SettingsButton');
    if (elem) {
      setTimeout(() => { elem.focus(); }, 1);
    }
  }

  /**
   * Change current settings in state
   * @param {string} key - identifier used to save value to state's current object
   * @param {*} value - new value
   */
  handleChange(key, value) {
    const { currentSettings } = this.state;
    const newCurrent = {
      ...currentSettings,
    };
    newCurrent[key] = value;

    this.setState({
      currentSettings: newCurrent,
    });
  }

  /**
   * Reset current setting selections
   */
  resetCurrentSelections() {
    const { previousSettings } = this.state;
    this.setState({
      currentSettings: previousSettings,
      saved: false,
    });
  }

  /**
   * Save new settings to redux
   */
  saveSettings() {
    const { currentSettings } = this.state;
    const {
      toggleHearingAid, toggleColorblind, toggleVisuallyImpaired, setMobility, settings,
    } = this.props;

    // Map redux actions with used setting keys
    const actions = {
      colorblind: toggleColorblind,
      hearingAid: toggleHearingAid,
      visuallyImpaired: toggleVisuallyImpaired,
      mobility: setMobility,
    };

    try {
      // Save each changed value
      Object.keys(currentSettings).forEach((key) => {
        const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
        const currentHasKey = Object.prototype.hasOwnProperty.call(currentSettings, key);
        if (settingsHasKey && currentHasKey) {
          const oldValue = settings[key];
          const newValue = currentSettings[key];
          if (oldValue !== newValue) {
            // Handle mobility 'none' case by using value null
            if (key === 'mobility' && newValue === 'none') {
              actions[key](null); // Send redux action to save data
            } else {
              actions[key](newValue); // Send redux action to save data
            }
          }
        }
      });
    } catch (e) {
      console.error('Error while saving new settings: ', e);
    }

    // Set new settings as previous
    this.setNewPreviousSettings(currentSettings);
    this.setAlert(true);
  }

  renderSenseSettings() {
    const { currentSettings } = this.state;
    const { classes } = this.props;

    const senseSettingList = {
      colorblind: {
        labelId: 'settings.sense.colorblind',
        value: currentSettings.colorblind,
        icon: <ColorblindIcon className={classes.icon} />,
      },
      hearingAid: {
        labelId: 'settings.sense.hearing',
        value: currentSettings.hearingAid,
        icon: <HearingIcon className={classes.icon} />,
      },
      visuallyImpaired: {
        labelId: 'settings.sense.visual',
        value: currentSettings.visuallyImpaired,
        icon: <VisualImpairmentIcon className={classes.icon} />,
      },
    };

    return (
      <Container>
        <SettingsTitle close={() => this.toggleSettingsContainer()} titleID="settings.sense.title" typography={{ component: 'h3' }} />
        <FormGroup row>
          <List className={classes.list}>
            {
              Object.keys(senseSettingList).map((key) => {
                if (Object.prototype.hasOwnProperty.call(senseSettingList, key)) {
                  const item = senseSettingList[key];
                  return (
                    <ListItem className={classes.checkbox} key={key}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            color="primary"
                            checked={!!item.value}
                            value={key}
                            onChange={() => {
                              this.setAlert(false);
                              this.handleChange(key, !item.value);
                            }}
                          />
                        )}
                        label={(
                          <>
                            {item.icon}
                            <FormattedMessage id={item.labelId} />
                          </>
                        )}
                      />
                    </ListItem>
                  );
                }
                return null;
              })
            }
          </List>
        </FormGroup>
      </Container>
    );
  }

  renderLanguageSettings() {
    // eslint-disable-next-line no-unused-vars
    const { settings } = this.props;
    return null;
  }

  renderMobilitySettings() {
    const { currentSettings } = this.state;
    const { classes, intl, setMobility } = this.props;

    // Check that currentSettings isn't empty
    if (Object.entries(currentSettings).length !== 0 && currentSettings.constructor === Object) {
      const mobilitySettings = {};
      SettingsUtility.mobilitySettings.forEach((setting) => {
        if (typeof setting === 'string') {
          mobilitySettings[setting] = {
            action: () => setMobility(setting),
            labelId: `settings.mobility.${setting}`,
            value: setting,
            icon: getIcon(setting, { className: classes.icon }),
          };
        } else if (setting === null) {
          mobilitySettings.none = {
            action: () => setMobility(null),
            labelId: 'settings.mobility.none',
            value: null,
            icon: getIcon('foot', { className: classes.icon }),
          };
        }
      });

      return (
        <Container>
          <FormControl className={classes.noMargin} component="fieldset" fullWidth>
            <FormLabel>
              <SettingsTitle titleID="settings.mobility.title" />
            </FormLabel>
            <RadioGroup
              aria-label={intl.formatMessage({ id: 'settings.mobility.title' })}
              classes={{
                root: classes.radioGroup,
              }}
              name="mobility"
              value={currentSettings.mobility}
              onChange={(event, value) => {
                this.handleChange('mobility', value);
                this.setAlert(false);
              }}
            >
              {
                Object.keys(mobilitySettings).map((key) => {
                  if (Object.prototype.hasOwnProperty.call(mobilitySettings, key)) {
                    const item = mobilitySettings[key];
                    return (
                      <FormControlLabel
                        className={classes.radioLabel}
                        key={key}
                        control={(
                          <Radio
                            color="primary"
                          />
                        )}
                        label={(
                          <>
                            {item.icon}
                            <FormattedMessage id={item.labelId} />
                          </>
                        )}
                        labelPlacement="end"
                        value={key}
                      />
                    );
                  }
                  return null;
                })
              }
            </RadioGroup>
          </FormControl>
        </Container>
      );
    } return (null);
  }

  renderConfirmationBox() {
    const { classes, isMobile } = this.props;
    const containerClasses = ` ${this.settingsHaveChanged() ? classes.stickyContainer : classes.hidden} ${isMobile ? classes.stickyMobile : ''}`;

    return (
      <Container className={`SettingsConfirmation ${containerClasses}`} paper>
        <Typography className={classes.confirmationText}><FormattedMessage id="general.save.confirmation" /></Typography>
        <Container className={classes.confirmationButtonContainer}>
          <Button
            className={classes.flexBase}
            color="primary"
            onClick={() => this.resetCurrentSelections()}
            variant="text"
          >
            <FormattedMessage id="general.cancel" />
          </Button>
          <Button
            className={classes.flexBase}
            color="primary"
            onClick={() => this.saveSettings()}
            variant="text"
          >
            <FormattedMessage id="general.save" />
          </Button>
        </Container>
      </Container>
    );
  }

  renderSaveAlert() {
    const { classes, intl, isMobile } = this.props;

    const containerClasses = `SettingsAlert ${classes.alert} ${isMobile ? classes.stickyMobile : ''}`;
    const typographyClasses = `${classes.flexBase} ${classes.alertText}`;
    const buttonClasses = `${classes.flexBase} ${classes.bold} ${classes.alertColor}`;

    return (
      <Container aria-hidden="true" className={containerClasses} paper>
        <Typography color="inherit" className={typographyClasses}><FormattedMessage id="general.save.changes.done" /></Typography>
        <Button
          aria-label={intl.formatMessage({ id: 'general.closeSettings' })}
          className={buttonClasses}
          color="primary"
          onClick={() => {
            this.setAlert(false);
          }}
          variant="text"
        >
          <FormattedMessage id="general.close" />
        </Button>
      </Container>
    );
  }

  render() {
    const {
      classes,
      intl,
    } = this.props;
    const { alert, containerStyles, saved } = this.state;
    const settingsHaveChanged = this.settingsHaveChanged();
    const settingsHaveBeenSaved = !settingsHaveChanged && saved;
    const showAlert = !settingsHaveChanged && alert;

    return (
      <>
        <div id="SettingsContainer" className={`${classes.container}`} style={containerStyles}>
          <>
            {
              showAlert
              && (
                this.renderSaveAlert()
              )
            }
            {
              settingsHaveChanged
              && (
                this.renderConfirmationBox()
              )
            }
            <div className="SettingsContent">
              <Typography variant="srOnly" component="h2" tabIndex="-1">
                <FormattedMessage id="settings" />
              </Typography>
              {
                  this.renderLanguageSettings()
                }

              {
                  this.renderSenseSettings()
                }

              <Divider aria-hidden="true" />

              {
                  this.renderMobilitySettings()
                }
              <ServiceMapButton className={classes.contentButton} color="primary" variant="contained" onClick={() => this.saveSettings()} disabled={!settingsHaveChanged}>
                <FormattedMessage id="general.save.changes" />
              </ServiceMapButton>
              <ServiceMapButton aria-label={intl.formatMessage({ id: 'general.closeSettings' })} className={classes.contentButton} color="primary" variant="contained" onClick={() => this.toggleSettingsContainer()}>
                <FormattedMessage id="general.close" />
              </ServiceMapButton>
            </div>

            <Typography aria-live="polite" variant="srOnly">
              {
                  settingsHaveChanged
                  && (
                    <FormattedMessage id="settings.aria.changed" />
                  )
                }
              {
                  settingsHaveBeenSaved
                  && (
                    <FormattedMessage id="settings.aria.saved" />
                  )
                }
            </Typography>
          </>
        </div>
      </>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  toggleColorblind: PropTypes.func.isRequired,
  toggleHearingAid: PropTypes.func.isRequired,
  toggleVisuallyImpaired: PropTypes.func.isRequired,
  setMobility: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  toggleSettings: PropTypes.func.isRequired,
};

Settings.defaultProps = {
  isMobile: false,
};

export default injectIntl(Settings);
