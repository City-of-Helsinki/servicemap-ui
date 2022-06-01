import useMediaQuery from '@mui/material/useMediaQuery';
import config from '../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;

const useMobileStatus = () => useMediaQuery(`(max-width:${mobileBreakpoint}px)`);

export default useMobileStatus;
