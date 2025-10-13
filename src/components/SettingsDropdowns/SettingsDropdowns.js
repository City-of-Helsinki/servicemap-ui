/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import config from '../../../config';
import { resetMobilityTreeSelections } from '../../redux/actions/mobilityTree';
import { resetServiceTreeSelections } from '../../redux/actions/serviceTree';
import {
  resetAccessibilitySettings,
  resetCitySettings,
  resetOrganizationSettings,
  setMapType,
} from '../../redux/actions/settings';
import {
  changeTheme,
  resetCustomPosition,
  resetUserPosition,
} from '../../redux/actions/user';
//import { selectSettings } from '../../redux/selectors/settings';
import SettingsUtility from '../../utils/settings';
//import useLocaleText from '../../utils/useLocaleText';
import SMButton from '../ServiceMapButton';
//import constants from '../SettingsComponent/constants';
// import SMAutocomplete from '../SMAutocomplete';

function SettingsDropdowns({ variant = 'default' }) {
  const intl = useIntl();
  const dispatch = useDispatch();
  // Format settings from redux to easier structure
  //const [openSettings, setOpenSettings] = useState(null);
  const [resetText, setResetText] = useState('');

  //const highlightedOption = useRef(null);
  // const themeMode = useSelector(selectThemeMode);
  const ownSettingsVariant = variant === 'ownSettings';

  // Configure rendered settings items
  const senseSettingList = [
    {
      value: 'colorblind',
      label: intl.formatMessage({ id: 'settings.sense.colorblind' }),
    },
    {
      value: 'hearingAid',
      label: intl.formatMessage({ id: 'settings.sense.hearingAid' }),
    },
    {
      value: 'visuallyImpaired',
      label: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }),
    },
  ];
  const mobilitySettingList = [
    {
      value: 'none',
      label: intl.formatMessage({ id: 'settings.mobility.none' }),
    },
    {
      value: 'wheelchair',
      label: intl.formatMessage({ id: 'settings.mobility.wheelchair' }),
    },
    {
      value: 'reduced_mobility',
      label: intl.formatMessage({ id: 'settings.mobility.reduced_mobility' }),
    },
    {
      value: 'rollator',
      label: intl.formatMessage({ id: 'settings.mobility.rollator' }),
    },
    {
      value: 'stroller',
      label: intl.formatMessage({ id: 'settings.mobility.stroller' }),
    },
  ];
  const citySettingsList = config.cities.map((city) => ({
    value: city,
    label: intl.formatMessage({ id: `settings.city.${city}` }),
  }));

  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
      title:
        'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
      title: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
      title: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];

  /*
  const toggleSettingsBox = (value) => {
    if (openSettings === value) setOpenSettings(null);
    else setOpenSettings(value);
  };

  */
  /*
  const handleOptionSelecting = (value, category) => {
    console.log(value);

    if (!value) {
      return;
    }

    setResetText('');

    if (category === 'mobility') {
      dispatch(setMobility(value));
      setOpenSettings(null);
    }
    if (category === 'cities') {
      const settingObj = settings.cities;
      settingObj[value] = !settingObj[value];
      dispatch(toggleCity(settingObj));
    }

    if (category === 'organizations') {
      const settingObj = settings.organizations;
      settingObj[value] = !settingObj[value];
      dispatch(toggleOrganization(settingObj));
    }

    if (category === 'senses') {
      if (value === 'hearingAid') {
        dispatch(toggleHearingAid());
      }
      // settingsValues.senses contains all previous sense settings. So now if it does not include
      // "value" then it was turned on just now.
      const settingTurnedOn = !settingsValues.senses.includes(value);
      if (value === 'colorblind') {
        dispatch(toggleColorblind());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
      if (value === 'visuallyImpaired') {
        dispatch(toggleVisuallyImpaired());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
    }
  };

  */

  const resetSettings = () => {
    dispatch(resetAccessibilitySettings());
    dispatch(resetCitySettings());
    dispatch(resetOrganizationSettings());
    dispatch(setMapType(SettingsUtility.defaultMapType));
    dispatch(resetServiceTreeSelections());
    dispatch(resetMobilityTreeSelections());
    dispatch(resetCustomPosition());
    dispatch(changeTheme('default'));
    dispatch(resetUserPosition());

    setResetText(intl.formatMessage({ id: 'settings.reset_button.ariaLive' }));
  };

  const renderSettingsElement = (options, label, category, isSingleOption) => {
    /*  const getValueP = () => {
      if (category === 'mobility') {
        const val = options.find(
          (option) => settingsValues.mobility === option.value
        );
        return val?.label || null;
      }
      const list = options.filter((option) =>
        settingsValues[category].includes(option.value)
      );
      return list.map((item) => item.label);
    }; */

    return (
      <Autocomplete
        multiple
        limitTags={2}
        id={label}
        options={top100Films}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title}
        defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
        renderInput={(params) => (
          <TextField {...params} label="limitTags" placeholder="Favorites" />
        )}
      />
    );
  };

  return (
    <>
      {renderSettingsElement(
        senseSettingList,
        intl.formatMessage({ id: 'settings.choose.senses' }),
        'senses'
      )}
      {renderSettingsElement(
        mobilitySettingList,
        intl.formatMessage({ id: 'settings.choose.mobility' }),
        'mobility',
        true
      )}
      {renderSettingsElement(
        citySettingsList,
        intl.formatMessage({ id: 'settings.choose.cities' }),
        'cities'
      )}
      <div>
        <Typography aria-live="polite" style={visuallyHidden}>
          {resetText}
        </Typography>
        <StyledButton
          data-sm="reset-settings-button"
          ownsettings={+ownSettingsVariant}
          color={ownSettingsVariant ? 'primary' : 'default'}
          role="button"
          aria-label={intl.formatMessage({ id: 'settings.reset_button.title' })}
          messageID="settings.reset_button.title"
          onClick={resetSettings}
        />
      </div>
    </>
  );
}

const StyledButton = styled(SMButton)(() => ({ marginRight: 0 }));

/*
const StyledAutocomplete = styled(SMAutocomplete)(({
  theme,
  ownsettings,
  colormode,
}) => {
  const whiteChip = {
    color: theme.palette.white.contrastText,
    backgroundColor: theme.palette.white.main,
  };
  const styles = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '& .MuiAutocomplete-tag':
      colormode === 'dark'
        ? whiteChip
        : {
            color: theme.palette.white.main,
            backgroundColor: 'rgb(47, 60, 187)',
          },
  };
  if (!ownsettings) {
    return {
      ...styles,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    };
  }
  const ownSettingsStyles = {
    backgroundColor: theme.palette.white.main,
    '& .MuiInputLabel-root': {
      color: theme.palette.white.contrastText,
    },
    '&.Mui-focused .MuiInputLabel-root': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiAutocomplete-input': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.dark,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.dark,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiAutocomplete-tag': whiteChip,
  };
  return { ...styles, ...ownSettingsStyles };
});

*/

SettingsDropdowns.propTypes = {
  variant: PropTypes.oneOf(['default', 'ownSettings']),
};

export default SettingsDropdowns;
