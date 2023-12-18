import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import config from '../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;

const useMobileStatus = () => {
  const isInitialLoadMobile = useSelector((state) => state.user.initialLayoutMobile);
  const isMobileLayout = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);

  return isInitialLoadMobile || isMobileLayout;
};

export default useMobileStatus;
