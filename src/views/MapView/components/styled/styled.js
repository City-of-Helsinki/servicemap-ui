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

export {
  StyledHslIcon,
  StyledAreaPopup,
};
