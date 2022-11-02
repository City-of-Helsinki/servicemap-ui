import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Link, Paper, Typography } from '@mui/material';
import { getIcon } from '../../../SMIcon';
import styles from './styles';
import useLocaleText from '../../../../utils/useLocaleText';
import ServiceMapButton from '../../../ServiceMapButton';

const NewsItem = ({ classes, item }) => {
  const getLocaleText = useLocaleText();
  if (!item || !item.title) {
    return null;
  }
  const {
    title,
    lead_paragraph: leadParagraph,
    picture_url: pictureURL,
    external_url_title: eUrlTitle,
    external_url: eUrl,
  } = item;

  const tTitle = title && getLocaleText(title);
  const tLeadParagraph = leadParagraph && getLocaleText(leadParagraph);
  const teUrlTitle = eUrlTitle && getLocaleText(eUrlTitle);
  const urlHref = eUrl && eUrl !== '' ? getLocaleText(eUrl) : false;
  const icon = getIcon('servicemapLogoIcon', {
    className: classes.icon,
  });
  const imgSrc = pictureURL && pictureURL !== '' ? pictureURL : false;

  return (
    <Paper className={classes.container}>
      <div className='row padding'>
        {icon}
        <div className={`column ${classes.titleContainer}`}>
          <Typography variant='subtitle1' component='h4'>
            {tTitle}
          </Typography>
        </div>
      </div>
      {imgSrc && <img alt='' src={imgSrc} className={classes.image} />}

      <div
        className={`column ${!imgSrc ? classes.hidePaddingTop : ''} ${
          classes.bottomContent
        }`}
      >
        <Typography align='left' component='p' variant='body2'>
          {tLeadParagraph}
        </Typography>
        {teUrlTitle && urlHref && (
          <ServiceMapButton
            onClick={() => window.open(urlHref)}
            role='link'
            color='primary'
            className={classes.newsButton}
          >
            <Typography align='left' variant='body2' component='p'>
              {teUrlTitle}
            </Typography>
          </ServiceMapButton>
        )}
      </div>
    </Paper>
  );
};

NewsItem.propTypes = {
  classes: PropTypes.shape({
    newsButton: PropTypes.string,
    bottomContent: PropTypes.string,
    container: PropTypes.string,
    hidePaddingTop: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    titleContainer: PropTypes.string,
    subtitle: PropTypes.string,
  }).isRequired,
  item: PropTypes.shape({
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
  }).isRequired,
};

export default withStyles(styles)(NewsItem);
