import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import BackButton from '../BackButton';
import useMobileStatus from '../../utils/isMobile';
import config from '../../../config';

const { topBarHeightMobile } = config;

const TitleBar = ({
  backButton,
  backButtonOnClick,
  backButtonText,
  backButtonSrText,
  title,
  titleComponent,
  icon,
  shareLink,
  className,
  ariaHidden,
  sticky,
}) => {
  const isMobile = useMobileStatus();
  const componentClasses = `${className || ''}${sticky ? ' sticky' : ''}`;

  return (
    <StyledContainer
      data-sm="TitleBar"
      titlebar={(!backButton && !icon) || undefined}
      multiline={backButton || undefined}
      stickymobile={(sticky && isMobile) || undefined}
      stickydesktop={(sticky && !isMobile) || undefined}
      className={componentClasses}
    >
      <StyledLinkContainer>
        {
          backButton
          && (
          <StyledBackButton
            onClick={backButtonOnClick}
            text={backButtonText}
            ariaLabel={backButtonSrText}
            variant="container"
          />
          )
        }
        {
          !backButton
          && icon
          && (
            <StyledIcon aria-hidden="true">
              {icon}
            </StyledIcon>
          )
        }
      </StyledLinkContainer>
      <StyledTitleContainer
        data-sm="TitleContainer"
      >
        <StyledTitle
          aria-hidden={ariaHidden}
          large={+!!backButton}
          className="TitleText"
          component={titleComponent}
          tabIndex={-1}
        >
          {title}
        </StyledTitle>
        {shareLink && (
          <StyledShareLink>
            {shareLink}
          </StyledShareLink>
        )}
      </StyledTitleContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled('div')(({
  theme, textbar, multiline, stickymobile, stickydesktop,
}) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    height: 44,
    background: theme.palette.primary.main,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.5)',
    color: '#fff',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  };
  if (textbar) {
    Object.assign(styles, {
      paddingLeft: theme.spacing(2),
    });
  }
  if (multiline) {
    Object.assign(styles, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      height: 72,
    });
  }
  if (stickymobile) {
    Object.assign(styles, {
      position: 'sticky',
      top: topBarHeightMobile,
      zIndex: 100,
    });
  }
  if (stickydesktop) {
    Object.assign(styles, {
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.sticky,
    });
  }
  return styles;
});

const StyledLinkContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
}));

const StyledIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  color: 'inherit',
  margin: theme.spacing(1),
  padding: 0,
}));

const StyledTitleContainer = styled('div')(() => ({
  flexDirection: 'row',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const StyledTitle = styled(Typography)(({ large }) => {
  const styles = {
    fontSize: '1.125rem',
    color: 'inherit',
    flex: '1 1 auto',
    textTransform: 'none',
    textAlign: 'left',
    '&:focus': {
      outlineStyle: 'none',
    },
    height: 'auto',
  };
  if (large) {
    Object.assign(styles, {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    });
  }
  return styles;
});


const StyledShareLink = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: 'inherit',
  marginLeft: 'auto',
  paddingLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  minWidth: 50,
  flex: '0 0 auto',
}));

const StyledBackButton = styled(BackButton)(({ theme }) => ({
  display: 'flex',
  color: 'inherit',
  flex: '0 1 auto',
  padding: 0,
  paddingBottom: theme.spacing(1.5),
  margin: 0,
  fontSize: '1.125rem',
  marginLeft: theme.spacing(-0.5),
}));

TitleBar.propTypes = {
  backButton: PropTypes.bool,
  backButtonOnClick: PropTypes.func,
  backButtonText: PropTypes.string,
  backButtonSrText: PropTypes.string,
  title: PropTypes.node.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  shareLink: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  ariaHidden: PropTypes.bool,
  sticky: PropTypes.bool,
};

TitleBar.defaultProps = {
  backButton: false,
  backButtonOnClick: null,
  backButtonText: null,
  backButtonSrText: null,
  icon: null,
  className: null,
  shareLink: null,
  ariaHidden: false,
  sticky: false,
};

export default TitleBar;
