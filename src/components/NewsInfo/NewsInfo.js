import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage } from 'react-intl';
import NewsItem from './components/NewsItem/NewsItem';

const NewsInfo = ({ showCount, news }) => {
  if (!news.length) {
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
  news: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  showCount: PropTypes.number,
};

NewsInfo.defaultProps = {
  showCount: 1,
};

export default NewsInfo;
