import PropTypes from 'prop-types';
import {
  Chip, Container, NoSsr, Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsAccordionCollapsed } from '../../redux/actions/settings';
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

  const setSettingsCollapsed = (collapsed) => {
    dispatch(setSettingsAccordionCollapsed(collapsed));
  };

  // Returns number of selected settings, sense: 0-n, mobility: 0-1, cities: 0-n
  const getSelectedSettingsCount = () => {
    const sense = settingsValues.senses.length;
    const mobility = settingsValues.mobility !== 'none' ? 1 : 0;
    const cities = settingsValues.cities.length;
    return sense + mobility + cities;
  };


  let classNames = '';
  if (variant === 'paddingTopSettings') {
    classNames = `${classes.paddingTopSettings}`;
  }

  const chipLabel = intl.formatMessage({ id: 'settings.accordion.open' });
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
                { getSelectedSettingsCount() > 0 && (
                  <StyledChipContainer>
                    <StyledChip
                      tabIndex={-1}
                      key="all"
                      clickable
                      size="small"
                      label={`${chipLabel} (${getSelectedSettingsCount()})`}
                    />
                  </StyledChipContainer>
                )}
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

const StyledChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.white.contrastText,
  backgroundColor: theme.palette.white.main,
  flex: 1,
  marginRight: theme.spacing(1),
  minWidth: 'unset',
  maxWidth: 'fit-content',
  '&:hover': {
    backgroundColor: theme.palette.white.main,
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
