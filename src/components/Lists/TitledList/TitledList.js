import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ArrowDropDown } from '@mui/icons-material';
import styled from '@emotion/styled';
import SMButton from '../../ServiceMapButton';

const TitledList = ({
  children,
  buttonMessageID,
  buttonMessageCount,
  buttonID,
  title,
  titleComponent,
  divider,
  onButtonClick,
  loading,
  subtitle,
  description,
  id,
}) => {
  const list = children;

  return (
    <>
      {title ? (
        <StyledContainer>
          <StyledTitleLeft
            component={titleComponent}
            variant="subtitle1"
          >
            {title}
          </StyledTitleLeft>
          {
          subtitle
          && (
            <StyledTitleRight
              component="p"
              variant="caption"
            >
              {subtitle}
            </StyledTitleRight>
          )
        }
        </StyledContainer>
      ) : null}
      {description && (
        <StyledDescription align="left">{description}</StyledDescription>
      )}
      {divider ? (
        <StyledDivider aria-hidden="true" />
      ) : null }

      <List disablePadding>
        {list}
      </List>
      {buttonMessageID && onButtonClick && !loading && (
        <SMButton
          id={buttonID}
          role="link"
          small
          messageID={buttonMessageID}
          messageCount={buttonMessageCount}
          icon={<StyledArrowDropDown />}
          textVariant="button"
          onClick={(e) => {
            e.preventDefault();
            onButtonClick();
          }}
          margin
        />
      )}
      {loading && (
        <StyledLoadingText aria-live="polite">
          <FormattedMessage id="general.loading" />
        </StyledLoadingText>
      )}
    </>
  );
};

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  lineHeight: `${24}px`,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  lineHeight: 'inherit',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledTitleLeft = styled(StyledTitle)(() => ({
  textAlign: 'right',
}));

const StyledTitleRight = styled(StyledTitle)(() => ({
  textAlign: 'right',
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledLoadingText = styled(Typography)(() => ({
  margin: 20,
  height: 34,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(-2),
}));

const StyledArrowDropDown = styled(ArrowDropDown)(({ theme }) => ({
  order: 2,
  marginRight: theme.spacing(-0.5),
}));

TitledList.propTypes = {
  buttonID: PropTypes.string,
  buttonMessageID: PropTypes.string,
  children: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  buttonMessageCount: PropTypes.number,
  divider: PropTypes.bool,
  onButtonClick: PropTypes.func,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  loading: PropTypes.bool,
  id: PropTypes.string,
};

TitledList.defaultProps = {
  buttonID: null,
  titleComponent: 'h3',
  divider: true,
  onButtonClick: null,
  title: null,
  description: null,
  buttonMessageCount: null,
  subtitle: null,
  buttonMessageID: null,
  loading: false,
  id: null,
};

export default TitledList;
