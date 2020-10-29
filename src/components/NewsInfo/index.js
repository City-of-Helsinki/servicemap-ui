import { withStyles } from '@material-ui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import styles from './styles';
import NewsInfo from './NewsInfo';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
const mapStateToProps = (state) => {
  const { alerts } = state;
  const { errors, news } = alerts;
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    errors: errors.data || [],
    getLocaleText,
    news: news.data || [],
  };
};

export default withStyles(styles)(injectIntl(connect(mapStateToProps)(NewsInfo)));
