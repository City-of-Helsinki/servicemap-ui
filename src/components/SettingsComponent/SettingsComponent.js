import PropTypes from 'prop-types';
import {
  Chip, Container, NoSsr, Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsAccordionCollapsed } from '../../redux/actions/settings';
import { uppercaseFirst } from '../../utils';
import SMAccordion from '../SMAccordion';
import SettingsDropdowns from '../SettingsDropdowns';
import constants from './constants';


const SettingsComponent = ({ variant, classes }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  // Format settings from redux to easier structure
  const settingsValues = constants.convertToSettingsValues(settings);
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
    constants.handleOptionSelecting(id, category, dispatch, settings.cities, settingsValues);
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
