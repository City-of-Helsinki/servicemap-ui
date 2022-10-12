import React from 'react';
import PropTypes from 'prop-types';
import { Map } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import {
  getIcon,
  MobileComponent,
  NewsInfo,
  PaperButton,
  SearchBar,
} from '../../components';
import config from '../../../config';
import { useNavigationParams } from '../../utils/address';
import useLocaleText from '../../utils/useLocaleText';
import CardSmall from '../../components/CardSmall/CardSmall';

const HomeView = (props) => {
  const { classes, toggleSettings, navigator, userLocation } = props;

  const getLocaleText = useLocaleText();
  const { formatMessage } = useIntl();
  const getAddressNavigatorParams = useNavigationParams();

  const renderNavigationOptions = () => {
    const noUserLocation =
      !userLocation || !userLocation.coordinates || !userLocation.addressData;

    const notFoundText = noUserLocation ? 'location.notFound' : null;
    const subtitleID =
      userLocation && userLocation.allowed
        ? notFoundText
        : 'location.notAllowed';

    let areaSelection = null;

    if (config.showAreaSelection) {
      areaSelection = (
        <CardSmall
          headerMessageID='area.services.local'
          messageID='home.buttons.area'
          onClick={() => navigator.push('area')}
        />
      );
    }

    return (
      <StyledContainer>
        {areaSelection}
        <CardSmall
          headerMessageID='area.services.local'
          messageID='home.buttons.services'
          onClick={() => navigator.push('serviceTree')}
        />
        <NewsInfo showCount={2} />
      </StyledContainer>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SearchBar hideBackButton header />
      {renderNavigationOptions()}
    </div>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  paddingTop: theme.spacing(1),
  // paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

export default HomeView;

// Typechecking
HomeView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  navigator: null,
  userLocation: null,
};
