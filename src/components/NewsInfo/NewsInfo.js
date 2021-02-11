import React from 'react';
import PropTypes from 'prop-types';
import NewsItem from './components/NewsItem/NewsItem';

const NewsInfo = ({
  showCount, news,
}) => {
  if (!news.length) {
    return null;
  }

  const dataToRender = news.slice(0, showCount);

  return dataToRender.map(item => (
    <NewsItem item={item} />
  ));
};

NewsInfo.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    lead_paragraph: PropTypes.shape({
      fi: PropTypes.string,
    }),
    title: PropTypes.shape({
      fi: PropTypes.string,
    }),
    picture_url: PropTypes.string,
    external_url_title: PropTypes.shape({
      fi: PropTypes.string,
    }),
    external_url: PropTypes.shape({
      fi: PropTypes.string,
    }),
  })).isRequired,
  showCount: PropTypes.number,
};

NewsInfo.defaultProps = {
  showCount: 1,
};

export default NewsInfo;
