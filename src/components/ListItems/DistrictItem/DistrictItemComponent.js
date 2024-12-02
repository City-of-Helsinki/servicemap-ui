import { Divider, ListItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import useLocaleText from '../../../utils/useLocaleText';
import { AreaIcon } from '../../SMIcon';

const DistrictItemComponent = ({
  area,
  hideDivider = false,
  paddedDivider = false,
  title = true,
}) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  if (!area || !area.id || !area.type || !area.origin_id) {
    return null;
  }

  const titleText = intl.formatMessage({ id: `area.list.${area.type}` });
  const getCustomRescueAreaTitle = area => `${!title ? `${titleText} ` : ''}${area.origin_id} - ${getLocaleText(area.name)}`;

  return (
    <Fragment key={area.id}>
      <StyledListItem>
        {
          title
          && (
            <StyledTitle variant="subtitle1">
              {titleText}
            </StyledTitle>
          )
        }
        <StyledTextContainer>
          <StyledAreaIcon />
          <StyledBoldText>
            {getCustomRescueAreaTitle(area)}
          </StyledBoldText>
        </StyledTextContainer>
      </StyledListItem>
      {
        !hideDivider
        && (
          <StyledLDividerItem paddedDivider={paddedDivider || undefined} aria-hidden>
            <Divider aria-hidden />
          </StyledLDividerItem>
        )
      }
    </Fragment>
  );
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledBoldText = styled(Typography)(() => ({
  fontWeight: 'bold',
}));

const StyledAreaIcon = styled(AreaIcon)(({ theme }) => ({
  fontSize: '1.25rem',
  marginLeft: 0,
  marginRight: theme.spacing(2),
}));

const StyledTextContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledLDividerItem = styled('li')(({ theme, paddedDivider }) => {
  const styles = {
    listStyleType: 'none',
  };
  if (paddedDivider) {
    styles.paddingLeft = theme.spacing(3);
  }
  return styles;
});

DistrictItemComponent.propTypes = {
  area: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.objectOf(PropTypes.any).isRequired,
    origin_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  hideDivider: PropTypes.bool,
  paddedDivider: PropTypes.bool,
  title: PropTypes.bool,
};

export default DistrictItemComponent;
