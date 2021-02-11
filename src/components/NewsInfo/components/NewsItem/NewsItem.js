import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { Link, Paper, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { getIcon } from '../../../SMIcon';
import styles from './styles';
import { getLocaleString } from '../../../../redux/selectors/locale';

const NewsItem = ({ classes, item, getLocaleText }) => {
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
      <div className="row padding">
        <Typography variant="srOnly" component="h3">
          <FormattedMessage id="general.news.info.title" />
        </Typography>
        {icon}
        <div className={`column ${classes.titleContainer}`}>
          <Typography variant="subtitle1" component="h4">{tTitle}</Typography>
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

NewsItem.propTypes = {
  classes: PropTypes.shape({
    bottomContent: PropTypes.string,
    container: PropTypes.string,
    hidePaddingTop: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    titleContainer: PropTypes.string,
    subtitle: PropTypes.string,
  }).isRequired,
  getLocaleText: PropTypes.func.isRequired,
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

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    getLocaleText,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(NewsItem));
