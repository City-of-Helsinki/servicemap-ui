import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectNews } from '../../redux/selectors/alerts';
import NewsItem from './components/NewsItem/NewsItem';

const NewsInfo = ({ showCount = 1 }) => {
  const news = useSelector(selectNews)?.data;
  if (!news?.length) {
    return null;
  }

  const newsItems = news
    .slice(0, showCount)
    .map((item) => (
      <NewsItem key={`news-item-${item?.title?.fi}`} item={item} />
    ));

  return (
    <>
      <Typography
        component='h3'
        variant='subtitle1'
        sx={{ textAlign: 'left', mt: 1 }}
      >
        <FormattedMessage id='general.news.info.title' />
      </Typography>
      {newsItems}
    </>
  );
};

NewsInfo.propTypes = {
  showCount: PropTypes.number,
};

export default NewsInfo;
