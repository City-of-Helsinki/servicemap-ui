import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';

import useLocaleText from '../../../../utils/useLocaleText';
import ServiceMapButton from '../../../ServiceMapButton';
import { getIcon } from '../../../SMIcon';

function NewsItem({ item }) {
  const getLocaleText = useLocaleText();
  const theme = useTheme();
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
  const iconClass = css({
    margin: theme.spacing(1, 1.5),
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#F4F4F4',
  });
  const icon = getIcon('servicemapLogoIcon', {
    className: iconClass,
  });
  const imgSrc = pictureURL && pictureURL !== '' ? pictureURL : false;

  return (
    <StyledPaper>
      <div className="row padding">
        {icon}
        <div className="column">
          <Typography variant="subtitle1" component="h4">
            {tTitle}
          </Typography>
        </div>
      </div>
      {imgSrc && <StyledImage alt="" src={imgSrc} />}

      <StyledBottomContent
        hidepaddingtop={!imgSrc || undefined}
        className="column"
      >
        <Typography align="left" component="p" variant="body2">
          {tLeadParagraph}
        </Typography>
        {teUrlTitle && urlHref && (
          <StyledServiceMapButton
            onClick={() => window.open(urlHref)}
            role="link"
            color="primary"
          >
            <Typography align="left" variant="body2" component="p">
              {teUrlTitle}
            </Typography>
          </StyledServiceMapButton>
        )}
      </StyledBottomContent>
    </StyledPaper>
  );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  flex: '0 0 auto',
  marginTop: theme.spacing(1),
  width: '100%',
  border: `1px solid ${theme.palette.border.main}`,
  borderRadius: '4px',
  textAlign: 'left',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '& .row': {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}`,
  },
  '& .column': {
    display: 'flex',
    flexDirection: 'column',
  },
  '& .padding': {
    padding: theme.spacing(1),
  },
  '& p': {
    marginBottom: theme.spacing(1.5),
  },
  '& p:last-child': {
    marginBottom: 0,
  },
  '& a': {
    textDecoration: 'underline',
  },
}));

const StyledImage = styled('img')(() => ({
  objectFit: 'cover',
  width: '100%',
  maxHeight: 200,
}));

const StyledServiceMapButton = styled(ServiceMapButton)(() => ({
  width: 'fit-content',
  marginLeft: 'auto',
  marginRight: 0,
}));

const StyledBottomContent = styled('div')(({ theme, hidepaddingtop }) => {
  const styles = {
    padding: theme.spacing(1.5, 2.5, 2, 2.5),
  };
  if (hidepaddingtop) {
    Object.assign(styles, {
      paddingTop: '0 !important',
    });
  }
  return styles;
});

NewsItem.propTypes = {
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

export default NewsItem;
