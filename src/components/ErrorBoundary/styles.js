import styled from '@emotion/styled';

import mapBackground from '../../assets/images/front-page-map-bg.png';
import HomeLogo from '../Logos/HomeLogo';

const StyledContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  margin: '84px auto',
  textAlign: 'left',
  padding: theme.spacing(2),
  zIndex: 'inherit',
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const StyledDiv = styled('div')(() => ({
  display: 'flex',
  position: 'absolute',
  background: `url(${mapBackground})`,
  backgroundSize: 'cover',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  zIndex: 1000,
}));

const BackGroundCover = styled('div')(() => ({
  background:
    'linear-gradient(180deg, #FFFFFF 42.74%, rgba(255, 255, 255, 0.0001) 100%)',
  opacity: 0.93,
}));

const ViewLogo = styled(HomeLogo)(({ theme }) => ({
  height: 60,
  marginBottom: theme.spacing(5),
}));

export { BackGroundCover, StyledContent, StyledDiv, ViewLogo };
