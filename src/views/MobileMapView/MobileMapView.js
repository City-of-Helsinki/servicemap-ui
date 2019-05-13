import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import HomeView from '../HomeView';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

const MobileMapView = ({ intl }) => (
  <>
    <MobileComponent>
      <SearchBar
        placeholder={intl.formatMessage({ id: 'search' })}
      />
    </MobileComponent>
    <DesktopComponent>
      <HomeView />
    </DesktopComponent>
  </>
);

MobileMapView.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(MobileMapView);
