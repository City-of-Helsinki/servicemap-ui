import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Button, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { selectErrors } from '../../redux/selectors/alerts';
import { focusToViewTitle } from '../../utils/accessibility';
import LocalStorageUtility from '../../utils/localStorage';
import useLocaleText from '../../utils/useLocaleText';
import { getIcon } from '../SMIcon';

// LocalStorage key for alert message
const lsKey = 'alertMessage';

function AlertBox() {
  const intl = useIntl();
  const getLocaleText = useLocaleText();

  const [visible, setVisible] = useState(true);
  const abData = useSelector(selectErrors)?.data;
  const savedMessage = LocalStorageUtility.getItem(lsKey);

  if (
    !visible ||
    !abData?.length ||
    JSON.stringify(abData[0].title) === savedMessage
  ) {
    return null;
  }

  const setMessageAsWatched = () => {
    LocalStorageUtility.saveItem(lsKey, JSON.stringify(abData[0].title));
  };
  const iconClass = css({
    width: 32,
    height: 32,
  });

  const endIconClass = css({
    marginLeft: 4,
  });

  const { title, lead_paragraph: leadParagraph } = abData[0];
  const tTitle = getLocaleText(title);
  const tLeadParagraph = getLocaleText(leadParagraph);
  const icon = getIcon('servicemapLogoIcon', {
    className: iconClass,
  });
  const closeButtonIcon = getIcon('closeIcon');
  const closeButtonText = intl.formatMessage({ id: 'general.close' });
  const closeButtonTextAria = intl.formatMessage({
    id: 'general.news.alert.close.aria',
  });
  const closeButtonClick = () => {
    setVisible(false);
    setMessageAsWatched();
    focusToViewTitle();
  };

  return (
    <StyledSection>
      <Typography style={visuallyHidden} component="h2">
        <FormattedMessage id="general.news.alert.title" />
      </Typography>
      <StyledCloseButton
        aria-label={closeButtonTextAria}
        color="inherit"
        classes={{
          endIcon: endIconClass,
        }}
        endIcon={closeButtonIcon}
        onClick={closeButtonClick}
      >
        {closeButtonText}
      </StyledCloseButton>
      {icon}
      <StyledTextContent>
        <StyledTitle component="h3" variant="subtitle1" color="inherit">
          {tTitle}
        </StyledTitle>
        <StyledMessageText color="inherit">{tLeadParagraph}</StyledMessageText>
      </StyledTextContent>
      <StyledPadder />
    </StyledSection>
  );
}

const StyledSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(3),
  color: '#fff',
  display: 'flex',
  backgroundColor: theme.palette.primary.main,
  borderBottom: '1px solid',
  borderColor: theme.palette.primary.contrastColor,
}));

const StyledTextContent = styled('div')(() => ({
  textAlign: 'left',
  paddingLeft: 10,
  paddingRight: 8,
}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
  textTransform: 'initial',
  fontSize: '0.75rem',
  position: 'absolute',
  top: 0,
  right: 0,
  margin: 8,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTitle = styled(Typography)(() => ({
  paddingBottom: 4,
}));

const StyledMessageText = styled(Typography)(() => ({
  lineHeight: 'normal',
  whiteSpace: 'pre-wrap',
}));

const StyledPadder = styled('div')(() => ({
  width: 100,
}));

export default AlertBox;
