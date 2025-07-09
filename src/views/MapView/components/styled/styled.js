import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledHslIcon = styled('span')(({ theme }) => ({
  fontFamily: 'hsl-piktoframe',
  color: '#fff',
  position: 'absolute',
  zIndex: theme.zIndex.behind,
  fontSize: 16,
  top: 16,
  left: 16,
}));

const StyledAreaPopup = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5),
  paddingTop: 22,
  paddingBottom: 14,
  display: 'flex',
  flexDirection: 'column',
}));

const StyledUnitTooltipWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2.5),
}));

const StyledUnitTooltipTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  margin: theme.spacing(0.5, 1),
  fontWeight: 'bold',
}));

const StyledCloseText = styled(Typography)(() => ({
  fontSize: '0.75rem',
  color: 'rgba(0,0,0,0.6)',
}));

export {
  StyledAreaPopup,
  StyledCloseText,
  StyledHslIcon,
  StyledUnitTooltipTitle,
  StyledUnitTooltipWrapper,
};
