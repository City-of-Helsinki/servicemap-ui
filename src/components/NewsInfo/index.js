import { connect } from 'react-redux';
import NewsInfo from './NewsInfo';

// Listen to redux state
const mapStateToProps = (state) => {
  const { alerts } = state;
  const { news } = alerts;

  return {
    news: news.data || [],
  };
};

export default connect(mapStateToProps)(NewsInfo);
