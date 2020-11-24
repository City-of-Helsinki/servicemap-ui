import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getLocaleString } from '../../redux/selectors/locale';
import AlertBox from './AlertBox';
import styles from './styles';

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

export default withStyles(styles)(injectIntl(connect(mapStateToProps)(AlertBox)));
