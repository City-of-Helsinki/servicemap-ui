import PropTypes from 'prop-types';
import {
  Chip, Container, NoSsr, Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMapType,
  setMobility,
  setSettingsAccordionCollapsed,
  toggleCity,
  toggleColorblind,
  toggleHearingAid,
  toggleVisuallyImpaired,
} from '../../redux/actions/settings';
import { uppercaseFirst } from '../../utils';
import SMAccordion from '../SMAccordion';
import SettingsDropdowns from '../SettingsDropdowns';
import constants from './constants';


const SettingsComponent = ({ variant, classes }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  const senses = ['colorblind', 'hearingAid', 'visuallyImpaired'];
  // Format settings from redux to easier structure
  const settingsValues = {
    mobility: settings.mobility,
    senses: Object.keys(settings)
      .filter(key => senses.includes(key) && settings[key] === true),
    cities: Object.keys(settings.cities)
      .filter(city => settings.cities[city] === true),
  };

  const settingsVisible = !settings.settingsCollapsed;

  const senseSettingList = constants.convertSettingsList(constants.senseSettingList, intl);
  const mobilitySettingList = constants.convertSettingsList(constants.mobilitySettingList, intl);

  const setSettingsCollapsed = (collapsed) => {
    dispatch(setSettingsAccordionCollapsed(collapsed));
  };

  // Returns settings as simple list of selected settings
  const getListOfSettings = () => {
    const sense = settingsValues.senses.map((sense) => {
      const match = senseSettingList.find(item => item.id === sense);
      return { title: match?.title, category: 'senses', id: sense };
    });
    const mobility = settingsValues.mobility !== 'none'
      ? mobilitySettingList.find(item => item.id === settingsValues.mobility)
      : null;

    return [
      ...sense,
      ...(mobility ? [mobility] : []).map(mobility => ({ title: mobility.title, category: 'mobility', id: mobility.id })),
      ...settingsValues.cities.map(city => ({ category: 'cities', id: city, title: city })),
    ];
  };


  const handleOptionDelete = (id, category) => {
    if (!id) return;
    if (category === 'mobility') {
      dispatch(setMobility(id));
    }
    if (category === 'cities') {
      const settingObj = settings.cities;
      settingObj[id] = !settingObj[id];
      dispatch(toggleCity(settingObj));
    }

    if (category === 'senses') {
      if (id === 'hearingAid') {
        dispatch(toggleHearingAid());
      }
      // settingsValues.senses contains all previous sense settings. So now if it does not include
      // "id" then it was turned on just now.
      const settingTurnedOn = !settingsValues.senses.includes(id);
      if (id === 'colorblind') {
        dispatch(toggleColorblind());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType('servicemap'));
        }
      }
      if (id === 'visuallyImpaired') {
        dispatch(toggleVisuallyImpaired());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType('servicemap'));
        }
      }
    }
  };


  const settingsList = getListOfSettings().slice(0, 2);
  let classNames = '';
  if (variant === 'paddingTopSettings') {
    classNames = `${classes.paddingTopSettings}`;
  }

  return (
    <NoSsr>
      <Container
        disableGutters
        sx={{ pb: 2, bgcolor: 'primary.main' }}
        className={classNames}
      >
        <StyledAccordion
          settingsVisible={settingsVisible}
          defaultOpen={settingsVisible}
          disableUnmount
          onOpen={(e, open) => setSettingsCollapsed(open)}
          titleContent={settingsVisible
            ? <Typography><FormattedMessage id="general.hideSettings" /></Typography>
            : (
              <>
                <Typography>
                  <FormattedMessage id="general.openSettings" />
                </Typography>
                <StyledChipContainer>
                  {settingsList.map(setting => (
                    <StyledChip
                      tabIndex={-1}
                      key={setting.id}
                      clickable
                      size="small"
                      label={uppercaseFirst(setting.title)}
                      onDelete={() => {
                        const settingId = setting.category === 'mobility' ? 'none' : setting.id;
                        handleOptionDelete(settingId, setting.category);
                      }}
                    />
                  ))}
                  <StyledChip
                    tabIndex={-1}
                    key="all"
                    all="true"
                    clickable
                    size="small"
                    label={intl.formatMessage({ id: 'settings.accordion.open' })}
                  />
                </StyledChipContainer>
              </>
            )
          }
          collapseContent={(<SettingsDropdowns />)}
        />
      </Container>
    </NoSsr>
  );
};


const StyledAccordion = styled(SMAccordion)(({ theme, settingsVisible }) => ({
  height: settingsVisible ? 32 : '100%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.highContrast,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(3),
  '& svg': {
    color: theme.palette.primary.highContrast,
  },
  '& button': {
    flexWrap: 'wrap',
  },
  '& p': {
    whiteSpace: 'nowrap',
  },
}));

const StyledChip = styled(Chip)(({ theme, all }) => ({
  color: all
    ? theme.palette.white.contrastText
    : theme.palette.white.main,
  backgroundColor: all
    ? theme.palette.white.main
    : 'rgb(47, 60, 187)',
  flex: all ? 2 : 1,
  marginRight: theme.spacing(1),
  minWidth: all ? 'unset' : 0,
  maxWidth: 'fit-content',

  '&:hover': {
    backgroundColor: all ? theme.palette.white.main : 'rgb(47, 60, 187)',
  },
  '& .MuiChip-deleteIcon': {
    color: theme.palette.white.main,
  },
}));


const StyledChipContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  order: 2,
}));

SettingsComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  variant: PropTypes.string,
};

SettingsComponent.defaultProps = {
  variant: null,
};

export default SettingsComponent;
