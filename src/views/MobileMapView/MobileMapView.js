import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import HomeView from '../HomeView';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

class MobileMapView extends React.Component {
  // Search submit functionality
  onSearchSubmit = (e, search) => {
    e.preventDefault();
    const {
      history, match,
    } = this.props;
    const { params } = match;
    const lng = params && params.lng;
    console.log(`Search query = ${search}`);

    if (history) {
      // TODO: Add query text once functionality is ready for search view
      history.push(`/${lng || 'fi'}/search/?q=${encodeURIComponent(search)}`);
    }
  };

  render() {
    const { intl } = this.props;
    return (
      <>
        <MobileComponent>
          <SearchBar
            placeholder={intl.formatMessage({ id: 'search' })}
            onSubmit={this.onSearchSubmit}
          />
        </MobileComponent>
        <DesktopComponent>
          <HomeView />
        </DesktopComponent>
      </>
    );
  }
}

MobileMapView.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default injectIntl(MobileMapView);
