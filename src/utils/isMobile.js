import useMediaQuery from '@material-ui/core/useMediaQuery';
import config from '../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;

const useMobileStatus = () => useMediaQuery(`(max-width:${mobileBreakpoint}px)`);

export default useMobileStatus;
