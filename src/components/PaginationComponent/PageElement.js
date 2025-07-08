import styled from '@emotion/styled';
import { ButtonBase, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { keyboardHandler } from '../../utils';

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: 0,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
}));

const StyledTypographyPageElement = styled(StyledTypography)(() => ({
  color: 'black',
  cursor: 'pointer',
  fontWeight: 'normal',
  textDecoration: 'none',
}));

const StyledTypographyPageElementActive = styled(StyledTypography)(() => ({
  cursor: 'auto',
  fontWeight: 'normal',
  textDecoration: 'underline',
}));

// Page number element
function PageElement({
  className = '',
  intl,
  isActive,
  number,
  onClick,
  ...rest
}) {
  const TypographyComponent = isActive
    ? StyledTypographyPageElementActive
    : StyledTypographyPageElement;
  return (
    <li>
      <ButtonBase
        role="link"
        disabled={isActive}
        onClick={onClick}
        onKeyDown={keyboardHandler(onClick, ['space', 'enter'])}
        tabIndex={isActive ? -1 : 0}
      >
        <TypographyComponent
          variant="subtitle1"
          component="p"
          className={className}
          {...rest}
        >
          <span aria-hidden="true">{number}</span>
        </TypographyComponent>
        <Typography style={visuallyHidden}>
          {isActive
            ? intl.formatMessage(
                { id: 'general.pagination.currentlyOpenedPage' },
                { count: number }
              )
            : intl.formatMessage(
                { id: 'general.pagination.openPage' },
                { count: number }
              )}
        </Typography>
      </ButtonBase>
    </li>
  );
}

PageElement.propTypes = {
  className: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isActive: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default injectIntl(PageElement);
