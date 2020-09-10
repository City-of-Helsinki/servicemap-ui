import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography,
  Divider,
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
import SettingsUtility from '../../utils/settings';
import Container from '../Container';
import {
  ColorblindIcon,
  HearingIcon,
  VisualImpairmentIcon,
  getIcon,
} from '../SMIcon';
import SMIcon from '../SMIcon/SMIcon';
import SettingsTitle from './SettingsTitle';
import TitleBar from '../TitleBar';
import SMButton from '../ServiceMapButton';
import config from '../../../config';

class Settings extends React.Component {
  buttonID = 'SettingsButton';

  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
    this.state = {
      alert: false,
      currentSettings: {},
      previousSettings: null,
      saved: false,
    };
  }

  componentDidMount() {
    const { current } = this.state;
    const { settings } = this.props;
    const {
      colorblind,
      hearingAid,
      mobility,
      visuallyImpaired,
      mapType,
    } = settings;

    // Create current settings from redux data
    const newCurrent = {
      ...current,
      colorblind,
      hearingAid,
      mobility: mobility !== null ? mobility : 'none',
      visuallyImpaired,
      mapType: mapType !== false ? mapType : 'servicemap',
      cities: {},
    };

    config.cities.forEach((city) => { newCurrent.cities[city] = settings.cities[city]; });

    this.setState({
      currentSettings: newCurrent,
      previousSettings: newCurrent,
    });

    setTimeout(() => {
      const settings = document.getElementsByClassName('SettingsTitle')[0];
      settings.firstChild.focus();
    }, 1);
  }

  componentWillUnmount() {
  }

  /**
   * Check if settings have changed compared to redux settings
   */
  settingsHaveChanged() {
    const { currentSettings } = this.state;
    const { settings } = this.props;
    let changed = false;
    let settingsByType = currentSettings;

    if (settings.toggled === 'mapSettings') {
      settingsByType = {
        mapType: currentSettings.mapType,
      };
    } else if (settings.toggled === 'accessibilitySettings') {
      settingsByType = {
        colorblind: currentSettings.colorblind,
        hearingAid: currentSettings.hearingAid,
        mobility: currentSettings.mobility,
        visuallyImpaired: currentSettings.visuallyImpaired,
      };
    }

    Object.keys(settingsByType).forEach((key) => {
      if (changed) {
        return;
      }
      if (key === 'cities') {
        config.cities.forEach((city) => {
          if (settings.cities[city] !== currentSettings.cities[city]) {
            changed = true;
          }
        });
      } else {
        const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
        const currentHasKey = Object.prototype.hasOwnProperty.call(settingsByType, key);
        if (settingsHasKey && currentHasKey) {
          const a = settings[key];
          let b = settingsByType[key];
          // Handle comparison with no mobility settings set
          if (key === 'mobility' && b === 'none') {
            b = null;
          }

          if (a !== b) {
            changed = true;
          }
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

  focusToFirstElement = () => {
    const dialog = this.dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[0].focus();
  }

  focusToLastElement = () => {
    const dialog = this.dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[buttons.length - 1].focus();
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
    const { settings } = this.props;
    setTimeout(() => {
      let elem;
      if (settings.toggled === 'search') {
        elem = document.getElementById('SettingsLink');
      } else if (settings.toggled === 'mobile') {
        elem = document.getElementById('MenuButton');
      } else {
        elem = document.getElementById(`SettingsButton${settings.toggled}`);
      }
      if (elem) {
        elem.focus();
      }
    }, 1);
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
    if (config.cities.includes(key)) {
      newCurrent.cities[key] = value;
    } else {
      newCurrent[key] = value;
    }

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
      toggleHearingAid,
      toggleColorblind,
      toggleVisuallyImpaired,
      setMobility,
      setMapType,
      toggleCity,
      changeTheme,
      settings,
    } = this.props;

    // Check if theme and map should be changed based on settings

    if (currentSettings.colorblind) {
      if (!settings.colorblind) {
        changeTheme('dark');
        if (settings.mapType === currentSettings.mapType) {
          currentSettings.mapType = 'accessible_map';
        }
      }
    } else if (settings.colorblind && !currentSettings.colorblind) {
      if (!currentSettings.visuallyImpaired) {
        changeTheme('default');
        if (settings.mapType === currentSettings.mapType) {
          currentSettings.mapType = 'servicemap';
        }
      }
    }

    if (currentSettings.visuallyImpaired) {
      if (!settings.visuallyImpaired) {
        changeTheme('dark');
        if (settings.mapType === currentSettings.mapType) {
          currentSettings.mapType = 'accessible_map';
        }
      }
    } else if (settings.visuallyImpaired && !currentSettings.visuallyImpaired) {
      if (!currentSettings.colorblind) {
        changeTheme('default');
        if (settings.mapType === currentSettings.mapType) {
          currentSettings.mapType = 'servicemap';
        }
      }
    }

    // Map redux actions with used setting keys
    const actions = {
      colorblind: toggleColorblind,
      hearingAid: toggleHearingAid,
      visuallyImpaired: toggleVisuallyImpaired,
      mobility: setMobility,
      mapType: setMapType,
      cities: toggleCity,
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

  renderSenseSettings(close) {
    const { currentSettings } = this.state;
    const { classes, intl } = this.props;

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
      <>
        <Container className={classes.formContainer}>
          <SettingsTitle
            id="SenseSettings"
            classes={classes}
            close={close ? () => this.toggleSettingsContainer() : null}
            intl={intl}
            titleID="settings.sense.title"
          />
          <FormGroup row role="group" aria-labelledby="SenseSettings">
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
        <Divider aria-hidden="true" />
      </>
    );
  }

  renderLanguageSettings() {
    // eslint-disable-next-line no-unused-vars
    const { settings } = this.props;
    return null;
  }

  renderMobilitySettings(close) {
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
        <>
          <Container className={classes.formContainer}>
            <FormControl className={classes.noMargin} component="fieldset" fullWidth>
              <FormLabel>
                <SettingsTitle
                  classes={classes}
                  titleID="settings.mobility.title"
                  intl={intl}
                  close={close ? () => this.toggleSettingsContainer() : null}
                />
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
          <Divider aria-hidden="true" />
        </>
      );
    } return (null);
  }

  renderCitySettings = (close) => {
    const { currentSettings } = this.state;
    const { classes, intl } = this.props;

    if (!currentSettings.cities) return null;

    const citySettingsList = config.cities;

    return (
      <>
        <Container className={classes.formContainer}>
          <SettingsTitle
            classes={classes}
            intl={intl}
            close={close ? () => this.toggleSettingsContainer() : null}
            id="CitySettings"
            titleID="settings.city.title"
          />
          <FormGroup row role="group" aria-labelledby="CitySettings">
            <List className={classes.list}>
              {
                citySettingsList.map(key => (
                  <ListItem className={classes.checkbox} key={key}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          color="primary"
                          checked={!!currentSettings.cities[key]}
                          value={key}
                          onChange={() => {
                            this.setAlert(false);
                            this.handleChange(key, !currentSettings.cities[key]);
                          }}
                        />
                        )}
                      label={(
                        <>
                          <SMIcon icon={`icon-icon-coat-of-arms-${key}`} />
                          <FormattedMessage id={`settings.city.${key}`} />
                        </>
                        )}
                    />
                  </ListItem>
                ))
            }
            </List>
          </FormGroup>
        </Container>
        <Divider aria-hidden="true" />
      </>
    );
  };

  renderMapSettings = (close) => {
    const { classes, intl, setMapType } = this.props;
    const { currentSettings } = this.state;

    // Check that currentSettings isn't empty
    if (Object.entries(currentSettings).length !== 0 && currentSettings.constructor === Object) {
      const mapSettings = {};
      SettingsUtility.mapSettings.forEach((setting) => {
        mapSettings[setting] = {
          action: () => setMapType(setting),
          labelId: `settings.map.${setting}`,
          value: setting,
          icon: getIcon(setting, { className: classes.icon }),
        };
      });

      return (
        <>
          <Container className={classes.formContainer}>
            <FormControl className={classes.noMargin} component="fieldset" fullWidth>
              <FormLabel>
                <SettingsTitle
                  classes={classes}
                  titleID="settings.map.title"
                  close={close ? () => this.toggleSettingsContainer() : null}
                  intl={intl}
                />
              </FormLabel>
              <RadioGroup
                aria-label={intl.formatMessage({ id: 'settings.map.title' })}
                classes={{
                  root: classes.radioGroup,
                }}
                name="mapType"
                value={currentSettings.mapType}
                onChange={(event, value) => {
                  this.handleChange('mapType', value);
                  this.setAlert(false);
                }}
              >
                {Object.keys(mapSettings).map((key) => {
                  if (Object.prototype.hasOwnProperty.call(mapSettings, key)) {
                    const item = mapSettings[key];
                    return (
                      <FormControlLabel
                        className={classes.radioLabel}
                        value={key}
                        key={key}
                        control={(<Radio color="primary" />)}
                        labelPlacement="end"
                        label={(
                          <>
                            {item.icon}
                            {<FormattedMessage id={item.labelId} />}
                          </>
                    )}
                      />
                    );
                  } return null;
                })}
              </RadioGroup>
            </FormControl>
          </Container>
          <Divider aria-hidden="true" />
        </>
      );
    } return null;
  }

  renderConfirmationBox() {
    const { classes, isMobile } = this.props;
    const containerClasses = ` ${this.settingsHaveChanged() ? classes.stickyContainer : classes.hidden} ${isMobile ? classes.stickyMobile : ''}`;

    return (
      <Container className={`SettingsConfirmation ${containerClasses}`} paper>
        <Typography>
          <FormattedMessage id="general.save.changes" />
        </Typography>
        <Container className={`${classes.confirmationButtonContainer} ${classes.right}`}>
          <SMButton
            small
            role="button"
            messageID="general.save"
            onClick={() => {
              this.saveSettings();
              this.dialogRef.current.querySelector('h2').focus();
            }}
            color="primary"
          />
          <SMButton
            small
            role="button"
            messageID="general.cancel"
            onClick={() => {
              this.resetCurrentSelections();
              this.dialogRef.current.querySelector('h2').focus();
            }}
          />
        </Container>
      </Container>
    );
  }

  renderSaveAlert() {
    const { classes, isMobile } = this.props;
    const containerClasses = `SettingsAlert ${classes.alert} ${isMobile ? classes.stickyMobile : ''}`;
    const typographyClasses = `${classes.flexBase} ${classes.alertText}`;

    return (
      <Container aria-hidden="true" className={containerClasses} paper>
        <Typography color="inherit" className={typographyClasses}><FormattedMessage id="general.save.changes.done" /></Typography>
      </Container>
    );
  }

  render() {
    const { classes, settings, intl } = this.props;
    const { alert, saved } = this.state;
    const settingsPage = settings.toggled;
    const settingsHaveChanged = this.settingsHaveChanged();
    const settingsHaveBeenSaved = !settingsHaveChanged && saved;
    const showAlert = !settingsHaveChanged && alert;

    let pageContent = (
      <>
        {this.renderSenseSettings('close')}
        {this.renderMobilitySettings()}
        {this.renderCitySettings()}
        {this.renderMapSettings()}
      </>
    );

    if (settingsPage === 'citySettings') {
      pageContent = this.renderCitySettings('close');
    } else if (settingsPage === 'mapSettings') {
      pageContent = this.renderMapSettings('close');
    } else if (settingsPage === 'accessibilitySettings') {
      pageContent = (
        <>
          {this.renderSenseSettings('close')}
          {this.renderMobilitySettings()}
        </>
      );
    }

    return (
      <div id="SettingsContainer" className={`${classes.container}`} ref={this.dialogRef} role="dialog">
        {/* Empty element that makes keyboard focus loop in dialog */}
        <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={() => this.focusToLastElement()} />

        <TitleBar id="SettingsTitle" className="SettingsTitle" titleComponent="h2" title={<FormattedMessage id={`settings.${settingsPage}.long`} />} />
        <>
          {showAlert && (
            this.renderSaveAlert()
          )}

          {settingsHaveChanged && (
            this.renderConfirmationBox()
          )}

          {pageContent}
          <Container className={`${classes.confirmationButtonContainer}`}>
            <SMButton
              small
              role="button"
              disabled={!settingsHaveChanged}
              onClick={() => this.saveSettings()}
              messageID="general.save.changes"
              color="primary"
            />
            <SMButton
              aria-label={intl.formatMessage({ id: 'general.closeSettings' })}
              small
              role="button"
              onClick={() => this.toggleSettingsContainer()}
              messageID="general.close"
            />
          </Container>

          <Typography aria-live="polite" variant="srOnly">
            {settingsHaveChanged && (
              <FormattedMessage id="settings.aria.changed" />
            )}
            {settingsHaveBeenSaved && (
              <FormattedMessage id="settings.aria.saved" />
            )}
          </Typography>
        </>
        {/* Empty element that makes keyboard focus loop in dialog */}
        <Typography variant="srOnly" aria-hidden tabIndex="0" onFocus={() => this.focusToFirstElement()} />
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleColorblind: PropTypes.func.isRequired,
  toggleHearingAid: PropTypes.func.isRequired,
  toggleVisuallyImpaired: PropTypes.func.isRequired,
  toggleCity: PropTypes.func.isRequired,
  setMobility: PropTypes.func.isRequired,
  setMapType: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  toggleSettings: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

Settings.defaultProps = {
  isMobile: false,
};

export default Settings;
