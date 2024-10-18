import React from 'react';
import { Link, Typography } from '@mui/material';
import styled from '@emotion/styled';
import RouteIcon from '@mui/icons-material/DirectionsBus';
import { useIntl } from 'react-intl';
import routeDetails from '../../views/UnitView/utils/routeDetails';

function RouteBar({ unit, userLocation }) {
  const intl = useIntl();

  const { routeUrl, extraText } = routeDetails(unit, userLocation);
  const text = intl.formatMessage({ id: 'unit.route' });
  const linkText = `${text}${extraText}`;

  return (
    <StyledContainer>
      <Link target="_blank" href={routeUrl}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledIcon />
          <Typography style={{ textAlign: 'left' }}>
            {linkText}
          </Typography>
        </div>
      </Link>
    </StyledContainer>
  );
}

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  background: 'paper',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));

const StyledIcon = styled(RouteIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export default RouteBar;
