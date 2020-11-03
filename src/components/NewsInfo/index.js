import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles';
import NewsInfo from './NewsInfo';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
const mapStateToProps = (state) => {
  const { alerts } = state;
  const { news } = alerts;
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    getLocaleText,
    news: news.data || [],
  };
};

export default withStyles(styles)(connect(mapStateToProps)(NewsInfo));
