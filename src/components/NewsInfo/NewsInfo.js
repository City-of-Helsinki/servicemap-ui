import React from 'react';
import PropTypes from 'prop-types';
import { Link, Paper, Typography } from '@material-ui/core';
import { getIcon } from '../SMIcon';

const NewsInfo = ({
  classes, getLocaleText, news,
}) => {
  if (!news.length) {
    return null;
  }

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
  const icon = getIcon('servicemapLogoIcon', {
    className: classes.icon,
  });
  const imgSrc = pictureURL && pictureURL !== '' ? pictureURL : false;

  return (
    <Paper className={classes.container}>
      <div className="row padding">
        {icon}
        <div className={`column ${classes.titleContainer}`}>
          <Typography variant="subtitle1" component="h3">{tTitle}</Typography>
        </div>
      </div>
      {
        imgSrc
        && (
          <img alt="" src={imgSrc} className={classes.image} />
        )
      }

      <div className={`column ${!imgSrc ? classes.hidePaddingTop : ''} ${classes.bottomContent}`}>
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
