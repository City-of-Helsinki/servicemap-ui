import React from 'react';
import PropTypes from 'prop-types';
import { Link, Paper, Typography } from '@material-ui/core';
import { getIcon } from '../SMIcon';

const NewsInfo = ({
  classes, getLocaleText, intl, news,
}) => {
  if (!news.length) {
    return null;
  }

  const subtitle = intl.formatMessage({ id: 'newsInfo.subtitle' });

  const {
    title,
    lead_paragraph: leadParagraph,
    picture_url: pictureURL,
    external_url_title: eUrlTitle,
    external_url: eUrl,
  } = news[0];
  const tTitle = title && getLocaleText(title);
  const tLeadParagraph = leadParagraph && getLocaleText(leadParagraph);
  const teUrlTitle = eUrlTitle && getLocaleText(eUrlTitle);
  const urlHref = eUrl && eUrl !== '' ? eUrl : false;
  // const teUrlTitle = tLeadParagraph;
  // const urlHref = 'https://www.google.com';
  const icon = getIcon('servicemapLogoIcon', {
    className: classes.icon,
  });
  const imgSrc = pictureURL && pictureURL !== '' ? pictureURL : false;
  // const imgSrc = 'https://kirkanta.kirjastot.fi/files/photos/medium/5d7147dd56b25029363143.JPG';

  return (
    <Paper className={classes.container}>
      <div className="row">
        {icon}
        <div className={`column ${classes.titleContainer}`}>
          <Typography variant="subtitle1" component="h3">{tTitle}</Typography>
          <Typography variant="body2" component="p">{subtitle}</Typography>
        </div>
      </div>
      {
        imgSrc
        && (
          <img alt="" src={imgSrc} className={classes.image} />
        )
      }

      <div className={`column padding ${!imgSrc ? classes.hidePaddingTop : ''}`}>
        <Typography
          align="left"
          component="p"
          variant="body2"
        >
          {tLeadParagraph}
        </Typography>
        {
          teUrlTitle
          && urlHref
          && (
            <Link href={urlHref} target="_blank">
              <Typography align="left" variant="body2" component="p">{teUrlTitle}</Typography>
            </Link>
          )
        }
      </div>
    </Paper>
  );
};

NewsInfo.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
  }).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  news: PropTypes.arrayOf(PropTypes.shape({
    lead_paragraph: PropTypes.shape({
      fi: PropTypes.string,
    }),
    title: PropTypes.shape({
      fi: PropTypes.string,
    }),
  })).isRequired,
};

export default NewsInfo;
