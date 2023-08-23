import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SettingsUtility from '../../utils/settings';
import EmbedderView from './EmbedderView';

const mapStateToProps = (state) => {
  const { navigator, settings } = state;
  const { mapType } = settings;

  return {
    citySettings: SettingsUtility.getActiveCitySettings(settings.cities),
    mapType,
    navigator,
  };
};

export default withRouter(injectIntl(connect(mapStateToProps)(EmbedderView)));
