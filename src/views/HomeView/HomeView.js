import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { NewsInfo, SearchBar } from '../../components';
import config from '../../../config';
import CardSmall from '../../components/CardSmall/CardSmall';
import areaServices from '../../assets/images/area-services.jpg';
import serviceTree from '../../assets/images/service-tree.jpg';

const HomeView = (props) => {
  const { navigator } = props;

  const renderNavigationOptions = () => {
    let areaSelection = null;

    if (config.showAreaSelection) {
      areaSelection = (
        <CardSmall
          image={areaServices}
          alt='Doctor seeing a patient'
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
          image={serviceTree}
          alt='Children playing'
          headerMessageID='general.pageTitles.serviceTree.title'
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
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

export default HomeView;

// Typechecking
HomeView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  navigator: null,
};
