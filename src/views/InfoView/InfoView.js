/* eslint-disable max-len */

import styled from '@emotion/styled';
import { ButtonBase, NoSsr, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import config from '../../../config';
import { TitleBar } from '../../components';
import useMobileStatus from '../../utils/isMobile';
import MarkdownRenderer from './MarkdownRenderer';

function InfoView({ locale }) {
  const isMobile = useMobileStatus();
  const [markdownContent, setMarkdownContent] = useState('');

  const a11yURLs = config.accessibilityStatementURL;
  const localeUrl =
    !a11yURLs[locale] || a11yURLs[locale] === 'undefined'
      ? null
      : a11yURLs[locale];

  const handleClick = () => {
    window.open(localeUrl);
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const module = await import(
          `./about-service-and-accessibility-${locale}.md?raw`
        );

        setMarkdownContent(module.default);
      } catch (error) {
        console.error('Failed to load markdown content:', error);

        setMarkdownContent('Content not available in current language');
      }
    };

    loadMarkdownContent();
  }, [locale]);

  const renderTitlebar = () => (
    <TitleBar
      sticky
      ariaHidden
      backButton={!isMobile}
      title={<FormattedMessage id="info.title" />}
      titleComponent="h3"
      data-sm="InfoPageTitle"
    />
  );
  const renderFinnishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Palvelukartan saavutettavuus
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <MarkdownRenderer markdown={markdownContent} />
    </StyledTextContainer>
  );

  const renderEnglishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Accessibility of the Service Map
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <MarkdownRenderer markdown={markdownContent} />
    </StyledTextContainer>
  );

  const renderSwedishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Servicekartans tillgänglighet
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <MarkdownRenderer markdown={markdownContent} />
    </StyledTextContainer>
  );

  const version = config.version || '';
  const commit = config.commit ? `${config.commit}` : '';
  const versionText = `Version: ${version} ${config.version && config.commit ? '-' : ''} ${commit}`;

  return (
    <div>
      <StyledPageContainer>
        {renderTitlebar()}
        {locale === 'fi' && renderFinnishInfo()}
        {locale === 'en' && renderEnglishInfo()}
        {locale === 'sv' && renderSwedishInfo()}
        <NoSsr>
          {config.version || config.commit ? (
            <StyledText align="left" aria-hidden="true">
              {versionText}
            </StyledText>
          ) : null}
        </NoSsr>
      </StyledPageContainer>
    </div>
  );
}

// Typechecking
InfoView.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default InfoView;

const StyledPageContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StyledLinkButton = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  fontSize: '1rem',
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

const StyledText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  textAlign: 'left',
  '& h3': {
    fontWeight: 'bold',
    fontSize: '1.063rem',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  '& h4': {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));
